// ============================================
// AdminSettings.jsx - COMPLETE FILE
// ============================================
import React, { useState, useEffect } from "react";

const AdminSettings = ({
  logoImage: initialLogo,
  headerImage: initialHeader,
  onSave,
}) => {
  const [logoImage, setLogoImage] = useState(initialLogo);
  const [logoFileName, setLogoFileName] = useState("");
  const [headerImages, setHeaderImages] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [headerFilesChanged, setHeaderFilesChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLogoImage(initialLogo);
  }, [initialLogo]);

  useEffect(() => {
    const images = Array.isArray(initialHeader)
      ? initialHeader.map((img, idx) => ({
          data: img,
          name: `Image ${idx + 1}`,
        }))
      : initialHeader
      ? [{ data: initialHeader, name: "Image 1" }]
      : [];
    setHeaderImages(images);
  }, [initialHeader]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image too large. Max 5MB.");
        return;
      }
      setLogoFileName(file.name);
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
        setHeaderImages((prev) => [
          ...prev,
          { data: reader.result, name: file.name },
        ]);
        setHeaderFilesChanged(true);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeHeaderImage = (index) => {
    setHeaderImages((prev) => prev.filter((_, i) => i !== index));
    setHeaderFilesChanged(true);
    setHasChanges(true);
  };

  const deleteLogo = () => {
    if (window.confirm("Delete logo?")) {
      setLogoImage("");
      setLogoFileName("");
      setLogoFile(""); // Empty string, not null - this will trigger save
      setHasChanges(true);
    }
  };

  const clearAllHeaders = () => {
    if (window.confirm("Delete all header images?")) {
      setHeaderImages([]);
      setHeaderFilesChanged(true);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    console.log("=== SAVING SETTINGS ===");
    console.log(
      "Logo file to save:",
      logoFile ? "YES (length: " + logoFile.length + ")" : "NO"
    );
    console.log("Header images changed:", headerFilesChanged);
    console.log("Header images count:", headerImages.length);

    const headerImagesData = headerImages.map((img) => img.data);
    const headerImagesJson = headerFilesChanged
      ? JSON.stringify(headerImagesData)
      : null;

    console.log("Calling onSave with:", {
      logo: logoFile !== null,
      header: headerImagesJson !== null,
    });

    await onSave(logoFile, headerImagesJson);

    setHasChanges(false);
    setLogoFile(null);
    setHeaderFilesChanged(false);
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
      marginRight: "0.5rem",
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
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "1rem",
      marginTop: "1rem",
    },
    imageItem: {
      position: "relative",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      background: "#fff",
    },
    imageContainer: {
      position: "relative",
      paddingTop: "66%",
      overflow: "hidden",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    imageName: {
      padding: "0.5rem",
      fontSize: "0.85rem",
      color: "#333",
      background: "#f8f9fa",
      textAlign: "center",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
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
      zIndex: 10,
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
    fileName: {
      fontSize: "0.9rem",
      color: "#666",
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
          <>
            <img
              src={logoImage}
              alt="Logo preview"
              style={{ ...styles.previewImage, maxHeight: "100px" }}
            />
            {logoFileName && <p style={styles.fileName}>{logoFileName}</p>}
          </>
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
                <div style={styles.imageContainer}>
                  <img src={img.data} alt={img.name} style={styles.image} />
                  <button
                    onClick={() => removeHeaderImage(index)}
                    style={styles.removeButton}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
                <div style={styles.imageName} title={img.name}>
                  {img.name}
                </div>
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
