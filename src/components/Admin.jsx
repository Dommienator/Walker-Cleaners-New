import React, { useState, useEffect } from "react";
import Bookings from "./Bookings";
import ServiceEditor from "./ServiceEditor";
import PackageEditor from "./PackageEditor";
import AdminHeader from "./AdminHeader";
import AdminSettings from "./AdminSettings";
import AdminList from "./AdminList";
import {
  getServices,
  saveService,
  deleteService,
  getPackages,
  savePackage,
  deletePackage,
  getSettings,
  saveHeaderImage,
  saveLogo,
  migrateDefaultData,
} from "../supabase";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentView, setCurrentView] = useState("services");
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [headerImage, setHeaderImage] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [notification, setNotification] = useState("");

  const ADMIN_PASSWORD = "walker2024";

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("walkerAdminAuth");
    const rememberedAuth = localStorage.getItem("walkerAdminRemember");
    if (savedAuth || rememberedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      sessionStorage.setItem("walkerAdminAuth", "true");
      if (rememberMe) {
        localStorage.setItem("walkerAdminRemember", "true");
      }
    }
  }, [isAuthenticated, rememberMe]);

  const loadData = async () => {
    console.log("Loading admin data...");

    await migrateDefaultData();

    const servicesData = await getServices();
    const packagesData = await getPackages();
    const settingsData = await getSettings();

    console.log("Services loaded:", servicesData);
    console.log("Packages loaded:", packagesData);
    console.log("Settings loaded:", settingsData);

    setServices(servicesData);
    setPackages(packagesData);

    // Parse header_image as array
    if (settingsData.header_image) {
      try {
        const parsed = JSON.parse(settingsData.header_image);
        console.log("Parsed header images:", parsed);
        setHeaderImage(
          Array.isArray(parsed) ? parsed : [settingsData.header_image]
        );
      } catch (e) {
        console.log("Failed to parse header_image, using as single:", e);
        setHeaderImage([settingsData.header_image]);
      }
    } else {
      setHeaderImage([]);
    }

    setLogoImage(settingsData.logo_image || "");
    console.log("Logo set to:", settingsData.logo_image || "");
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("walkerAdminAuth");
    localStorage.removeItem("walkerAdminRemember");
  };

  const handleServiceSave = async (service) => {
    console.log("Saving service:", service);
    const success = await saveService(service);
    if (success) {
      await loadData();
      setEditingService(null);
      showNotification("Service saved successfully!");
    } else {
      alert("Failed to save service.");
    }
  };

  const handlePackageSave = async (pkg) => {
    console.log("Saving package:", pkg);
    const success = await savePackage(pkg);
    if (success) {
      await loadData();
      setEditingPackage(null);
      showNotification("Package saved successfully!");
    } else {
      alert("Failed to save package.");
    }
  };

  const handleServiceDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      const success = await deleteService(id);
      if (success) {
        await loadData();
        showNotification("Service deleted!");
      }
    }
  };

  const handlePackageDelete = async (id) => {
    if (window.confirm("Delete this package?")) {
      const success = await deletePackage(id);
      if (success) {
        await loadData();
        showNotification("Package deleted!");
      }
    }
  };

  const handleEditService = (service) => {
    console.log("Editing service:", service);
    setEditingService({
      id: service.id,
      title: service.title,
      description: service.description,
      images: service.images || [],
      isNew: false,
    });
  };

  const handleEditPackage = (pkg) => {
    console.log("Editing package:", pkg);
    setEditingPackage({
      id: pkg.id,
      title: pkg.title,
      includes: pkg.includes,
      description: pkg.description,
      images: pkg.images || [],
      isNew: false,
    });
  };

  const handleAddService = () => {
    setEditingService({
      isNew: true,
      title: "",
      description: "",
      images: [],
    });
  };

  const handleAddPackage = () => {
    setEditingPackage({
      isNew: true,
      title: "",
      includes: [],
      description: "",
      images: [],
    });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f5f5f5",
      padding: "2rem",
    },
    loginBox: {
      maxWidth: "400px",
      margin: "5rem auto",
      background: "white",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      marginBottom: "1rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      background: "#0066cc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: "600",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    notification: {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#28a745",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 1000,
      maxWidth: "400px",
    },
    notificationLink: {
      color: "white",
      textDecoration: "underline",
      display: "block",
      marginTop: "0.5rem",
      fontSize: "0.9rem",
    },
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <form style={styles.loginBox} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: "1.5rem", color: "#003d7a" }}>
            Admin Login
          </h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Keep me logged in</label>
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    );
  }

  if (currentView === "bookings") {
    return (
      <div style={styles.container}>
        <Bookings onBack={() => setCurrentView("services")} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {notification && (
        <div style={styles.notification}>
          {notification}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={styles.notificationLink}
          >
            View changes on website →
          </a>
        </div>
      )}

      <AdminHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />

      {currentView === "settings" && (
        <AdminSettings
          logoImage={logoImage}
          headerImage={headerImage}
          onSave={async (newLogo, newHeader) => {
            console.log("=== ADMIN SAVE HANDLER ===");
            console.log("newLogo:", newLogo);
            console.log("newHeader:", newHeader);

            // Handle logo - null means no change, "" means delete, string means update
            if (newLogo !== null) {
              console.log(
                "Saving logo:",
                newLogo === "" ? "DELETING" : "UPDATING"
              );
              const success = await saveLogo(newLogo);
              if (success) {
                setLogoImage(newLogo);
                showNotification(
                  newLogo === ""
                    ? "Logo deleted!"
                    : "Logo updated successfully!"
                );
              } else {
                alert("Failed to save logo");
                return;
              }
            }

            if (newHeader !== null) {
              console.log("Saving header images...");
              const success = await saveHeaderImage(newHeader);
              if (success) {
                try {
                  const parsed = JSON.parse(newHeader);
                  setHeaderImage(Array.isArray(parsed) ? parsed : []);
                  showNotification("Header images updated successfully!");
                } catch (e) {
                  console.error("Failed to parse header images:", e);
                  setHeaderImage([]);
                }
              } else {
                alert("Failed to save header images");
                return;
              }
            }

            console.log("Reloading data...");
            await loadData();
          }}
        />
      )}

      {currentView === "services" && (
        <>
          <h3 style={{ color: "#003d7a", marginBottom: "1rem" }}>
            Services ({services.length})
          </h3>
          <AdminList
            items={services}
            type="services"
            onEdit={handleEditService}
            onDelete={handleServiceDelete}
            onAdd={handleAddService}
          />
        </>
      )}

      {currentView === "packages" && (
        <>
          <h3 style={{ color: "#003d7a", marginBottom: "1rem" }}>
            Packages ({packages.length})
          </h3>
          <AdminList
            items={packages}
            type="packages"
            onEdit={handleEditPackage}
            onDelete={handlePackageDelete}
            onAdd={handleAddPackage}
          />
        </>
      )}

      {editingService && (
        <ServiceEditor
          service={editingService}
          onSave={handleServiceSave}
          onCancel={() => setEditingService(null)}
        />
      )}

      {editingPackage && (
        <PackageEditor
          package={editingPackage}
          onSave={handlePackageSave}
          onCancel={() => setEditingPackage(null)}
        />
      )}
    </div>
  );
};

export default Admin;
