import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== IMAGE UTILITIES ====================

// Convert base64 to blob
const base64ToBlob = (base64) => {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1]; // ← Keep original type
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
// Compress and upload image to Supabase Storage
// Compress and upload image to Supabase Storage
const uploadImage = async (base64Image, folder = "services") => {
  try {
    console.log("Starting upload for folder:", folder);

    // If it's already a URL, return it
    if (!base64Image.startsWith("data:image")) {
      console.log("Already a URL, returning:", base64Image);
      return base64Image;
    }

    console.log("Compressing image...");
    // Compress image first
    const compressed = await compressImage(base64Image, 800);

    console.log("Converting to blob...");
    // Convert to blob
    const blob = base64ToBlob(compressed);
    console.log("Blob size:", blob.size, "bytes");

    // Generate unique filename
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    console.log("Uploading to:", filename);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("service-images")
      .upload(filename, blob, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      console.error("Error message:", error.message);
      console.error("Error details:", error);
      throw error;
    }

    console.log("Upload successful, data:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(filename);

    console.log("Public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    return null;
  }
};

// Delete image from storage
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("supabase")) return;

    // Extract filename from URL
    const urlParts = imageUrl.split("/service-images/");
    if (urlParts.length < 2) return;

    const filename = urlParts[1].split("?")[0]; // Remove query params if any

    const { error } = await supabase.storage
      .from("service-images")
      .remove([filename]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Compress base64 images to reduce size
const compressImage = (base64, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Important: Don't fill background, leave it transparent
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Use PNG to preserve transparency
      resolve(canvas.toDataURL("image/png", 0.9));
    };
    img.src = base64;
  });
};

// ==================== SERVICES ====================

export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const saveService = async (service) => {
  try {
    // Upload images to storage and get URLs
    let imageUrls = [];
    if (service.images && service.images.length > 0) {
      const uploadPromises = service.images.map((img) =>
        uploadImage(img, "services"),
      );
      imageUrls = await Promise.all(uploadPromises);
      imageUrls = imageUrls.filter((url) => url !== null); // Remove failed uploads
    }

    // If updating, delete old images that are no longer used
    if (!service.isNew && service.id) {
      const { data: oldService } = await supabase
        .from("services")
        .select("images")
        .eq("id", service.id)
        .single();

      if (oldService && oldService.images) {
        const oldUrls = oldService.images;
        const removedUrls = oldUrls.filter((url) => !imageUrls.includes(url));
        for (const url of removedUrls) {
          await deleteImage(url);
        }
      }
    }

    if (service.isNew) {
      const { error } = await supabase.from("services").insert({
        title: service.title,
        description: service.description,
        images: imageUrls,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("services")
        .update({
          title: service.title,
          description: service.description,
          images: imageUrls,
        })
        .eq("id", service.id);

      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error("Error saving service:", error);
    return false;
  }
};

export const deleteService = async (id) => {
  try {
    // Get service images first
    const { data: service } = await supabase
      .from("services")
      .select("images")
      .eq("id", id)
      .single();

    // Delete the service
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    // Delete associated images from storage
    if (service && service.images) {
      for (const imageUrl of service.images) {
        await deleteImage(imageUrl);
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    return false;
  }
};

// ==================== PACKAGES ====================

export const getPackages = async () => {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

export const savePackage = async (pkg) => {
  try {
    // Upload images to storage and get URLs
    let imageUrls = [];
    if (pkg.images && pkg.images.length > 0) {
      const uploadPromises = pkg.images.map((img) =>
        uploadImage(img, "packages"),
      );
      imageUrls = await Promise.all(uploadPromises);
      imageUrls = imageUrls.filter((url) => url !== null);
    }

    // If updating, delete old images that are no longer used
    if (!pkg.isNew && pkg.id) {
      const { data: oldPackage } = await supabase
        .from("packages")
        .select("images")
        .eq("id", pkg.id)
        .single();

      if (oldPackage && oldPackage.images) {
        const oldUrls = oldPackage.images;
        const removedUrls = oldUrls.filter((url) => !imageUrls.includes(url));
        for (const url of removedUrls) {
          await deleteImage(url);
        }
      }
    }

    if (pkg.isNew) {
      const { error } = await supabase.from("packages").insert({
        title: pkg.title,
        includes: pkg.includes,
        description: pkg.description,
        images: imageUrls,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("packages")
        .update({
          title: pkg.title,
          includes: pkg.includes,
          description: pkg.description,
          images: imageUrls,
        })
        .eq("id", pkg.id);

      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error("Error saving package:", error);
    return false;
  }
};

export const deletePackage = async (id) => {
  try {
    // Get package images first
    const { data: pkg } = await supabase
      .from("packages")
      .select("images")
      .eq("id", id)
      .single();

    // Delete the package
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) throw error;

    // Delete associated images from storage
    if (pkg && pkg.images) {
      for (const imageUrl of pkg.images) {
        await deleteImage(imageUrl);
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting package:", error);
    return false;
  }
};

// ==================== BOOKINGS ====================

export const getBookings = async () => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const saveBooking = async (booking) => {
  try {
    console.log("Attempting to save booking:", booking);

    const { data, error } = await supabase.from("bookings").insert(booking);

    if (error) {
      console.error("Supabase error details:", error);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error hint:", error.hint);
      throw error;
    }

    console.log("Booking saved successfully:", data);
    return true;
  } catch (error) {
    console.error("Error saving booking:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return false;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

export const deleteBooking = async (id) => {
  try {
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    return false;
  }
};

// ==================== SETTINGS ====================

export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      return data[0];
    }

    return { header_image: "", logo_image: "" };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { header_image: "", logo_image: "" };
  }
};

export const saveLogo = async (logoData) => {
  try {
    console.log("saveLogo called with:", logoData ? "data present" : "no data");

    let logoUrl = logoData;

    // Upload logo to storage if it's base64 - WITHOUT compression
    if (logoData && logoData.startsWith("data:image")) {
      try {
        console.log("Converting logo to blob...");
        const blob = base64ToBlob(logoData);
        console.log("Blob created, size:", blob.size);

        const filename = `settings/logo-${Date.now()}.png`;
        console.log("Uploading to:", filename);

        const { data, error } = await supabase.storage
          .from("service-images")
          .upload(filename, blob, {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Storage upload error:", error);
          throw error;
        }

        console.log("Upload successful:", data);

        const { data: urlData } = supabase.storage
          .from("service-images")
          .getPublicUrl(filename);

        logoUrl = urlData.publicUrl;
        console.log("Public URL:", logoUrl);
      } catch (uploadError) {
        console.error("Error during logo upload:", uploadError);
        return false;
      }
    }

    // Get current settings
    const { data: settings, error: fetchError } = await supabase
      .from("settings")
      .select("id, logo_image")
      .limit(1);

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return false;
    }

    const settingsId = settings && settings.length > 0 ? settings[0].id : null;
    const oldLogoUrl =
      settings && settings.length > 0 ? settings[0].logo_image : null;

    // Update or insert
    if (settingsId) {
      const { error } = await supabase
        .from("settings")
        .update({ logo_image: logoUrl || "" })
        .eq("id", settingsId);

      if (error) {
        console.error("Error updating logo:", error);
        return false;
      }

      // Delete old logo from storage if it exists and is different
      if (
        oldLogoUrl &&
        oldLogoUrl !== logoUrl &&
        oldLogoUrl.includes("supabase")
      ) {
        await deleteImage(oldLogoUrl);
      }
    } else {
      const { error } = await supabase
        .from("settings")
        .insert({ logo_image: logoUrl || "" });

      if (error) {
        console.error("Error inserting logo:", error);
        return false;
      }
    }

    console.log("Logo saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveLogo:", error);
    return false;
  }
};
export const saveHeaderImage = async (headerData) => {
  try {
    // Parse the header data (it's a JSON string of image URLs/base64)
    let imageUrls = [];
    if (headerData && headerData !== "[]") {
      try {
        const images = JSON.parse(headerData);
        if (Array.isArray(images)) {
          const uploadPromises = images.map((img) =>
            uploadImage(img, "headers"),
          );
          imageUrls = await Promise.all(uploadPromises);
          imageUrls = imageUrls.filter((url) => url !== null);
        }
      } catch (e) {
        console.error("Error parsing header data:", e);
      }
    }

    const { data: settings, error: fetchError } = await supabase
      .from("settings")
      .select("id, header_image")
      .limit(1);

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return false;
    }

    const settingsId = settings && settings.length > 0 ? settings[0].id : null;
    const oldHeaderData =
      settings && settings.length > 0 ? settings[0].header_image : null;

    // Delete old header images if they exist
    if (oldHeaderData) {
      try {
        const oldImages = JSON.parse(oldHeaderData);
        if (Array.isArray(oldImages)) {
          for (const oldUrl of oldImages) {
            if (!imageUrls.includes(oldUrl)) {
              await deleteImage(oldUrl);
            }
          }
        }
      } catch (e) {
        console.error("Error parsing old header data:", e);
      }
    }

    const headerDataString = JSON.stringify(imageUrls);

    if (settingsId) {
      const { error } = await supabase
        .from("settings")
        .update({ header_image: headerDataString })
        .eq("id", settingsId);

      if (error) {
        console.error("Error updating header:", error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("settings")
        .insert({ header_image: headerDataString });

      if (error) {
        console.error("Error inserting header:", error);
        return false;
      }
    }

    console.log("Header images saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving header images:", error);
    return false;
  }
};

// ==================== DEFAULT DATA MIGRATION ====================

export const migrateDefaultData = async () => {
  try {
    const { data: existingServices } = await supabase
      .from("services")
      .select("id")
      .limit(1);

    if (existingServices && existingServices.length > 0) {
      console.log("Data already exists, skipping migration");
      return;
    }

    console.log("Migrating default data...");

    const defaultServices = [
      {
        title: "Deep Cleaning",
        description:
          "Thorough cleaning of your entire space, reaching every corner and crevice for a spotless result.",
        images: [],
      },
      {
        title: "Regular Cleaning",
        description:
          "Maintain a consistently clean environment with our scheduled cleaning service.",
        images: [],
      },
      {
        title: "Move In/Out Cleaning",
        description:
          "Comprehensive cleaning for properties during transitions, ensuring a fresh start or a perfect handover.",
        images: [],
      },
    ];

    const defaultPackages = [
      {
        title: "Basic Package",
        includes: [
          "Dusting all surfaces",
          "Vacuuming all floors",
          "Mopping hard floors",
          "Bathroom cleaning",
          "Kitchen cleaning",
        ],
        description: "Perfect for maintaining a clean home on a regular basis.",
        images: [],
      },
      {
        title: "Premium Package",
        includes: [
          "Everything in Basic Package",
          "Window cleaning (interior)",
          "Appliance cleaning",
          "Detailed dusting (including baseboards)",
          "Trash removal",
        ],
        description:
          "A more comprehensive clean for those who want extra attention to detail.",
        images: [],
      },
      {
        title: "Deep Clean Package",
        includes: [
          "Everything in Premium Package",
          "Inside cabinets and drawers",
          "Oven and refrigerator deep clean",
          "Wall washing",
          "Ceiling fan cleaning",
          "Light fixture cleaning",
        ],
        description:
          "Our most thorough cleaning service for a completely refreshed space.",
        images: [],
      },
    ];

    for (const service of defaultServices) {
      await supabase.from("services").insert(service);
    }

    for (const pkg of defaultPackages) {
      await supabase.from("packages").insert(pkg);
    }

    console.log("Default data migrated successfully");
  } catch (error) {
    console.error("Error migrating default data:", error);
  }
};
