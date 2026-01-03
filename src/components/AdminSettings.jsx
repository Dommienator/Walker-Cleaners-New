import React, { useState, useEffect } from "react";

const AdminSettings = ({ logoImage, headerImage, onSave }) => {
  const [newLogo, setNewLogo] = useState("");
  const [newHeader, setNewHeader] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setNewLogo(logoImage || "");
    setNewHeader(headerImage || "");
  }, [logoImage, headerImage]);

  useEffect(() => {
    const logoChanged = newLogo !== (logoImage || "");
    const headerChanged = newHeader !== (headerImage || "");
    setHasChanges(logoChanged || headerChanged);
  }, [newLogo, newHeader, logoImage, headerImage]);

  const handleSave = () => {
    const logoChanged = newLogo !== (logoImage || "");
    const headerChanged = newHeader !== (headerImage || "");

    onSave(logoChanged ? newLogo : null, headerChanged ? newHeader : null);
    setHasChanges(false);
  };

  const handleClearLogo = () => {
    setNewLogo("");
  };

  const handleClearHeader = () => {
    setNewHeader("");
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      margin: "0 auto",
    },
    title: {
      fontSize: "1.8rem",
      color: "#003d7a",
      marginBottom: "2rem",
    },
    section: {
      marginBottom: "2rem",
      paddingBottom: "2rem",
      borderBottom: "1px solid #eee",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      color: "#333",
      marginBottom: "1rem",
      fontWeight: "600",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#666",
      fontSize: "0.9rem",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
      boxSizing: "border-box",
      marginBottom: "0.5rem",
    },
    preview: {
      marginTop: "1rem",
      padding: "1rem",
      background: "#f5f5f5",
      borderRadius: "8px",
      textAlign: "center",
    },
    previewImage: {
      maxWidth: "100%",
      maxHeight: "200px",
      borderRadius: "8px",
    },
    previewText: {
      color: "#999",
      fontSize: "0.9rem",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "0.5rem",
    },
    clearButton: {
      padding: "0.6rem 1.2rem",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    saveButton: {
      padding: "1rem 2rem",
      background: hasChanges ? "#28a745" : "#ccc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: hasChanges ? "pointer" : "not-allowed",
      fontSize: "1.1rem",
      fontWeight: "600",
      marginTop: "2rem",
      width: "100%",
      transition: "background 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Settings</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Logo Image</h3>
        <label style={styles.label}>Enter logo image URL:</label>
        <input
          type="text"
          value={newLogo}
          onChange={(e) => setNewLogo(e.target.value)}
          placeholder="https://example.com/logo.png"
          style={styles.input}
        />
        <div style={styles.buttonGroup}>
          <button
            onClick={handleClearLogo}
            style={styles.clearButton}
            disabled={!newLogo}
          >
            Clear Logo
          </button>
        </div>
        <div style={styles.preview}>
          {newLogo ? (
            <img
              src={newLogo}
              alt="Logo preview"
              style={styles.previewImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : (
            <p style={styles.previewText}>No logo image</p>
          )}
          <p style={{ ...styles.previewText, display: "none" }}>
            Invalid image URL
          </p>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Header Background Image</h3>
        <label style={styles.label}>Enter header background image URL:</label>
        <input
          type="text"
          value={newHeader}
          onChange={(e) => setNewHeader(e.target.value)}
          placeholder="https://example.com/header.jpg"
          style={styles.input}
        />
        <div style={styles.buttonGroup}>
          <button
            onClick={handleClearHeader}
            style={styles.clearButton}
            disabled={!newHeader}
          >
            Clear Header
          </button>
        </div>
        <div style={styles.preview}>
          {newHeader ? (
            <img
              src={newHeader}
              alt="Header preview"
              style={styles.previewImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : (
            <p style={styles.previewText}>No header background image</p>
          )}
          <p style={{ ...styles.previewText, display: "none" }}>
            Invalid image URL
          </p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!hasChanges}
        style={styles.saveButton}
      >
        {hasChanges ? "Save Changes" : "No Changes"}
      </button>
    </div>
  );
};

export default AdminSettings;
