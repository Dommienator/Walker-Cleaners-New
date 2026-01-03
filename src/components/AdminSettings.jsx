// ============================================
// AdminSettings.jsx - RESTORED WORKING VERSION
// ============================================
import React, { useState } from "react";

const AdminSettings = ({
  logoImage: initialLogo,
  headerImage: initialHeader,
  onSave,
}) => {
  const [logoImage, setLogoImage] = useState(initialLogo);
  const [headerImages, setHeaderImages] = useState(
    Array.isArray(initialHeader)
      ? initialHeader
      : initialHeader
      ? [initialHeader]
      : []
  );
  const [logoFile, setLogoFile] = useState(null);
  const [headerFiles, setHeaderFiles] = useState(null);
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

  const handleHeaderImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5000000) {
        alert(`${file.name} is too large. Max 5MB per image.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImages((prev) => [...prev, reader.result]);
        setHeaderFiles(true);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeHeaderImage = (index) => {
    setHeaderImages((prev) => prev.filter((_, i) => i !== index));
    setHeaderFiles(true);
    setHasChanges(true);
  };

  const deleteLogo = () => {
    if (window.confirm("Delete logo?")) {
      setLogoImage(null);
      setLogoFile(null);
      setHasChanges(true);
    }
  };

  const clearAllHeaders = () => {
    if (window.confirm("Delete all header images?")) {
      setHeaderImages([]);
      setHeaderFiles(true);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    await onSave(logoFile, headerFiles ? headerImages : null);
    setHasChanges(false);
    setLogoFile(null);
    setHeaderFiles(null);
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
    uploadButton: {
      padding: "0.8rem 1.5rem",
      background: "#0066cc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      display: "inline-block",
      marginBottom: "1rem",
    },
    changeButton: {
      padding: "0.8rem 1.5rem",
      background: "#ffc107",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      display: "inline-block",
      marginBottom: "1rem",
      marginRight: "0.5rem",
    },
    deleteButton: {
      padding: "0.8rem 1.5rem",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      display: "inline-block",
      marginBottom: "1rem",
      marginRight: "0.5rem",
    },
    hiddenInput: {
      display: "none",
    },
    previewImage: {
      marginTop: "1rem",
      maxWidth: "100%",
      maxHeight: "200px",
      borderRadius: "8px",
      display: "block",
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "1rem",
      marginTop: "1rem",
    },
    imageItem: {
      position: "relative",
      paddingTop: "66%",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    removeButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1",
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
    noImage: {
      color: "#999",
      fontStyle: "italic",
      marginTop: "1rem",
    },
    hint: {
      color: "#666",
      fontSize: "0.9rem",
      marginTop: "0.5rem",
      fontStyle: "italic",
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
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={styles.hiddenInput}
        />
        <label
          htmlFor="logo-upload"
          style={logoImage ? styles.changeButton : styles.uploadButton}
        >
          {logoImage ? "Change Logo" : "Add Logo"}
        </label>

        {logoImage && (
          <button onClick={deleteLogo} style={styles.deleteButton}>
            Delete Logo
          </button>
        )}

        {logoImage ? (
          <img
            src={logoImage}
            alt="Logo preview"
            style={{ ...styles.previewImage, maxHeight: "100px" }}
          />
        ) : (
          <p style={styles.noImage}>No logo uploaded</p>
        )}
      </div>

      <div style={styles.headerImageSection}>
        <h3 style={{ color: "#003d7a", marginBottom: "1rem" }}>
          Header Background Images (Slideshow)
        </h3>

        <input
          id="header-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleHeaderImagesChange}
          style={styles.hiddenInput}
        />
        <label htmlFor="header-upload" style={styles.uploadButton}>
          Add Images ({headerImages.length})
        </label>

        {headerImages.length > 0 && (
          <button onClick={clearAllHeaders} style={styles.deleteButton}>
            Delete All
          </button>
        )}

        {headerImages.length > 0 ? (
          <div style={styles.imageGrid}>
            {headerImages.map((img, index) => (
              <div key={index} style={styles.imageItem}>
                <img
                  src={img}
                  alt={`Header ${index + 1}`}
                  style={styles.image}
                />
                <button
                  onClick={() => removeHeaderImage(index)}
                  style={styles.removeButton}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noImage}>No header images uploaded</p>
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
