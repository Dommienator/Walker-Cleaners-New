import { createClient } from "@supabase/supabase-js";
import { services as defaultServices } from "./data/services";
import { packages as defaultPackages } from "./data/packages";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Migrate data from default files to Supabase if tables are empty
export const migrateDefaultData = async () => {
  try {
    // Check if services exist
    const { data: existingServices } = await supabase
      .from("services")
      .select("id")
      .limit(1);

    // If no services exist, insert default ones
    if (!existingServices || existingServices.length === 0) {
      console.log("Migrating default services to Supabase...");
      const servicesToInsert = defaultServices.map(({ icon, ...service }) => ({
        ...service,
        images: service.images || [],
      }));

      await supabase.from("services").insert(servicesToInsert);
      console.log("Services migrated successfully!");
    }

    // Check if packages exist
    const { data: existingPackages } = await supabase
      .from("packages")
      .select("id")
      .limit(1);

    // If no packages exist, insert default ones
    if (!existingPackages || existingPackages.length === 0) {
      console.log("Migrating default packages to Supabase...");
      const packagesToInsert = defaultPackages.map((pkg) => ({
        ...pkg,
        images: pkg.images || [],
      }));

      await supabase.from("packages").insert(packagesToInsert);
      console.log("Packages migrated successfully!");
    }
  } catch (error) {
    console.error("Error migrating data:", error);
  }
};

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data || [];
};

export const saveService = async (service) => {
  try {
    if (service.isNew) {
      // Remove the isNew flag, id, and icon before inserting
      // Let Supabase auto-generate the ID
      const { isNew, id, icon, ...serviceData } = service;
      const { data, error } = await supabase
        .from("services")
        .insert([serviceData])
        .select();

      if (error) throw error;
      return true;
    } else {
      // Update existing service
      const { isNew, icon, ...serviceData } = service;
      const { error } = await supabase
        .from("services")
        .update(serviceData)
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

// Packages
export const getPackages = async () => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
  return data || [];
};

export const savePackage = async (pkg) => {
  try {
    if (pkg.isNew) {
      // Remove the isNew flag and id before inserting
      // Let Supabase auto-generate the ID
      const { isNew, id, ...packageData } = pkg;
      const { data, error } = await supabase
        .from("packages")
        .insert([packageData])
        .select();

      if (error) throw error;
      return true;
    } else {
      // Update existing package
      const { isNew, ...packageData } = pkg;
      const { error } = await supabase
        .from("packages")
        .update(packageData)
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

// Settings
export const getSettings = async () => {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Error fetching settings:", error);
    return { header_image: "", logo_image: "" };
  }
  return data || { header_image: "", logo_image: "" };
};

export const saveHeaderImage = async (imageUrl) => {
  try {
    const { error } = await supabase
      .from("settings")
      .upsert({ id: 1, header_image: imageUrl });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving header image:", error);
    return false;
  }
};

export const saveLogo = async (imageUrl) => {
  try {
    const { error } = await supabase
      .from("settings")
      .upsert({ id: 1, logo_image: imageUrl });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving logo:", error);
    return false;
  }
};

// Bookings
export const getBookings = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data || [];
};

export const saveBooking = async (booking) => {
  try {
    const { error } = await supabase.from("bookings").insert([
      {
        type: booking.type,
        service_or_package: booking.serviceOrPackage,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        address: booking.address,
        message: booking.message,
        status: "pending",
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving booking:", error);
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
