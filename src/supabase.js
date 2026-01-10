import { createClient } from "@supabase/supabase-js";
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
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = base64;
  });
};
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Compress images if they exist
    let compressedImages = service.images || [];
    if (compressedImages.length > 0) {
      compressedImages = await Promise.all(
        compressedImages.map((img) =>
          img.startsWith("data:image") ? compressImage(img, 600) : img
        )
      );
    }

    if (service.isNew) {
      const { error } = await supabase.from("services").insert({
        title: service.title,
        description: service.description,
        images: compressedImages,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("services")
        .update({
          title: service.title,
          description: service.description,
          images: compressedImages,
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
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) throw error;
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
    // Compress images if they exist
    let compressedImages = pkg.images || [];
    if (compressedImages.length > 0) {
      compressedImages = await Promise.all(
        compressedImages.map((img) =>
          img.startsWith("data:image") ? compressImage(img, 600) : img
        )
      );
    }

    if (pkg.isNew) {
      const { error } = await supabase.from("packages").insert({
        title: pkg.title,
        includes: pkg.includes,
        description: pkg.description,
        images: compressedImages,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("packages")
        .update({
          title: pkg.title,
          includes: pkg.includes,
          description: pkg.description,
          images: compressedImages,
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
    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) throw error;
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
    const { data: settings, error: fetchError } = await supabase
      .from("settings")
      .select("id")
      .limit(1);

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return false;
    }

    const settingsId = settings && settings.length > 0 ? settings[0].id : null;

    if (settingsId) {
      const { error } = await supabase
        .from("settings")
        .update({ logo_image: logoData || "" })
        .eq("id", settingsId);

      if (error) {
        console.error("Error updating logo:", error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("settings")
        .insert({ logo_image: logoData || "" });

      if (error) {
        console.error("Error inserting logo:", error);
        return false;
      }
    }

    console.log("Logo saved successfully:", logoData ? "Updated" : "Deleted");
    return true;
  } catch (error) {
    console.error("Error saving logo:", error);
    return false;
  }
};

export const saveHeaderImage = async (headerData) => {
  try {
    const { data: settings, error: fetchError } = await supabase
      .from("settings")
      .select("id")
      .limit(1);

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return false;
    }

    const settingsId = settings && settings.length > 0 ? settings[0].id : null;

    if (settingsId) {
      const { error } = await supabase
        .from("settings")
        .update({ header_image: headerData || "[]" })
        .eq("id", settingsId);

      if (error) {
        console.error("Error updating header:", error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("settings")
        .insert({ header_image: headerData || "[]" });

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
