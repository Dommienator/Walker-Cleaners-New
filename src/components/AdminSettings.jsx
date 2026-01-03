import React, { useState } from "react";

const AdminSettings = ({
  logoImage: initialLogo,
  headerImage: initialHeader,
  onSave,
}) => {
  const [logoImage, setLogoImage] = useState(initialLogo);
  const [headerImage, setHeaderImage] = useState(initialHeader);
  const [logoFile, setLogoFile] = useState(null);
  const [headerFile, setHeaderFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setLogoFile(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result);
        setHeaderFile(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await onSave(logoFile, headerFile);
    setHasChanges(false);
    setLogoFile(null);
    setHeaderFile(null);
  };

  const handleClearLogo = () => {
    setLogoImage("");
    setLogoFile("");
    setHasChanges(true);
  };

  const handleClearHeader = () => {
    setHeaderImage("");
    setHeaderFile("");
    setHasChanges(true);
  };

  const styles = {
    section: {
      maxWidth: "1200px",
      margin: "0 auto 2rem",
      background: "white",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    headerImageSection: {
      marginBottom: "2rem",
      padding: "1.5rem",
      background: "#f8f9fa",
      borderRadius: "8px",
    },
    fileInput: {
      padding: "0.8rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      width: "100%",
      cursor: "pointer",
      marginBottom: "1rem",
    },
    previewImage: {
      marginTop: "1rem",
      maxWidth: "100%",
      maxHeight: "200px",
      borderRadius: "8px",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "1rem",
    },
    clearButton: {
      padding: "0.6rem 1.2rem",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
    saveButton: {
      padding: "1rem 2rem",
      background: hasChanges ? "#28a745" : "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: hasChanges ? "pointer" : "not-allowed",
      marginTop: "2rem",
      width: "100%",
    },
  };

  return (
    <div style={styles.section}>
      <h2 style={{ color: "#003d7a", marginBottom: "1rem" }}>
        Website Settings
      </h2>

      <div style={styles.headerImageSection}>
        <h3 style={{ color: "#003d7a", marginBottom: "1rem" }}>Logo Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={styles.fileInput}
        />
        <div style={styles.buttonGroup}>
          {logoImage && (
            <button onClick={handleClearLogo} style={styles.clearButton}>
              Clear Logo
            </button>
          )}
        </div>
        {logoImage && (
          <img
            src={logoImage}
            alt="Logo preview"
            style={{ ...styles.previewImage, maxHeight: "100px" }}
          />
        )}
      </div>

      <div style={styles.headerImageSection}>
        <h3 style={{ color: "#003d7a", marginBottom: "1rem" }}>
          Header Background Image
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleHeaderChange}
          style={styles.fileInput}
        />
        <div style={styles.buttonGroup}>
          {headerImage && (
            <button onClick={handleClearHeader} style={styles.clearButton}>
              Clear Header
            </button>
          )}
        </div>
        {headerImage && (
          <img
            src={headerImage}
            alt="Header preview"
            style={styles.previewImage}
          />
        )}
      </div>

      <button
        onClick={handleSave}
        style={styles.saveButton}
        disabled={!hasChanges}
      >
        {hasChanges ? "Save Changes" : "No Changes"}
      </button>
    </div>
  );
};

export default AdminSettings;
