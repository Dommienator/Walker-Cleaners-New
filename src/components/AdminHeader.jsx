import React from "react";

const AdminHeader = ({ currentView, setCurrentView, handleLogout }) => {
  const styles = {
    header: {
      maxWidth: "1200px",
      margin: "0 auto 2rem",
      textAlign: "center",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    },
    viewWebsiteBtn: {
      padding: "0.6rem 1.2rem",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      textDecoration: "none",
      display: "inline-block",
    },
    tabs: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "1rem",
      flexWrap: "wrap",
    },
    tab: {
      padding: "0.8rem 1.5rem",
      background: "white",
      border: "2px solid #0066cc",
      color: "#0066cc",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      transition: "all 0.3s",
    },
    activeTab: {
      background: "#0066cc",
      color: "white",
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.topBar}>
        <h1 style={{ color: "#003d7a", margin: 0 }}>Walker Cleaners Admin</h1>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={styles.viewWebsiteBtn}
        >
          View Website
        </a>
      </div>
      <div style={styles.tabs}>
        <button
          onClick={() => setCurrentView("settings")}
          style={{
            ...styles.tab,
            ...(currentView === "settings" ? styles.activeTab : {}),
          }}
        >
          Settings
        </button>
        <button
          onClick={() => setCurrentView("services")}
          style={{
            ...styles.tab,
            ...(currentView === "services" ? styles.activeTab : {}),
          }}
        >
          Services
        </button>
        <button
          onClick={() => setCurrentView("packages")}
          style={{
            ...styles.tab,
            ...(currentView === "packages" ? styles.activeTab : {}),
          }}
        >
          Packages
        </button>
        <button
          onClick={() => setCurrentView("bookings")}
          style={{
            ...styles.tab,
            ...(currentView === "bookings" ? styles.activeTab : {}),
          }}
        >
          Bookings & History
        </button>
        <button
          onClick={handleLogout}
          style={{ ...styles.tab, borderColor: "#dc3545", color: "#dc3545" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
