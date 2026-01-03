import React, { useState } from "react";

const ServiceEditor = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: service.title || "",
    description: service.description || "",
    images: service.images || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...service,
      ...formData,
    });
  };

  const handleImageAdd = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({
            ...formData,
            images: [...formData.images, reader.result],
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
    },
    title: {
      fontSize: "1.8rem",
      color: "#003d7a",
      marginBottom: "1.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    labelText: {
      fontWeight: "600",
      color: "#333",
    },
    input: {
      padding: "0.8rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
    },
    textarea: {
      padding: "0.8rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
      minHeight: "120px",
      resize: "vertical",
    },
    imagesSection: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    imagesList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    imageItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem",
      background: "#f5f5f5",
      borderRadius: "6px",
    },
    imageUrl: {
      flex: 1,
      fontSize: "0.9rem",
      color: "#666",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    removeButton: {
      padding: "0.4rem 0.8rem",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    addImageButton: {
      padding: "0.6rem 1rem",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      alignSelf: "flex-start",
    },
    buttons: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
    saveButton: {
      padding: "0.8rem 1.5rem",
      background: "#0066cc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
    },
    cancelButton: {
      padding: "0.8rem 1.5rem",
      background: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {service.isNew ? "Add New Service" : "Edit Service"}
        </h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            <span style={styles.labelText}>Service Title</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            <span style={styles.labelText}>Description</span>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={styles.textarea}
              required
            />
          </label>

          <div style={styles.imagesSection}>
            <span style={styles.labelText}>Images</span>
            {formData.images.length > 0 && (
              <div style={styles.imagesList}>
                {formData.images.map((img, index) => (
                  <div key={index} style={styles.imageItem}>
                    <span style={styles.imageUrl}>{img}</span>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleImageAdd}
              style={styles.addImageButton}
            >
              + Upload Image
            </button>
          </div>

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditor;
