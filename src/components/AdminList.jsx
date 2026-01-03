import React from "react";

const AdminList = ({ items, type, onEdit, onDelete, onAdd }) => {
  const styles = {
    container: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "1.8rem",
      color: "#003d7a",
      margin: 0,
    },
    addButton: {
      padding: "0.8rem 1.5rem",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.5rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "#f9f9f9",
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#003d7a",
      marginBottom: "0.5rem",
    },
    itemDescription: {
      color: "#666",
      fontSize: "0.9rem",
    },
    actions: {
      display: "flex",
      gap: "0.5rem",
    },
    editButton: {
      padding: "0.6rem 1.2rem",
      background: "#0066cc",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    deleteButton: {
      padding: "0.6rem 1.2rem",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#999",
      fontSize: "1.1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {type === "services" ? "Services" : "Packages"}
        </h2>
        <button style={styles.addButton} onClick={onAdd}>
          + Add {type === "services" ? "Service" : "Package"}
        </button>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyState}>
          No {type} yet. Click the button above to add one.
        </div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.id} style={styles.item}>
              <div style={styles.itemInfo}>
                <div style={styles.itemTitle}>{item.title}</div>
                <div style={styles.itemDescription}>
                  {item.description?.substring(0, 100)}
                  {item.description?.length > 100 ? "..." : ""}
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.editButton} onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminList;
