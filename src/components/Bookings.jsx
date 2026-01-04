import React, { useState, useEffect } from "react";
import { getBookings, updateBookingStatus, deleteBooking } from "../supabase";
import { FaArrowLeft } from "react-icons/fa";

const Bookings = ({ onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const bookingsPerPage = 100;

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const bookingsData = await getBookings();
    setBookings(bookingsData);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success) {
      await loadBookings();
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const success = await deleteBooking(bookingId);
      if (success) {
        await loadBookings();
      }
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "fulfilled":
        return "#28a745";
      case "postponed":
        return "#17a2b8";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const styles = {
    container: {
      padding: "2rem",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    backButton: {
      background: "none",
      border: "none",
      color: "#0066cc",
      fontSize: "1.1rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontWeight: "600",
      padding: "0.5rem",
    },
    title: {
      color: "#003d7a",
      margin: 0,
    },
    stats: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
    },
    statCard: {
      padding: "1rem",
      borderRadius: "8px",
      flex: 1,
      minWidth: "150px",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "bold",
      margin: 0,
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#666",
      margin: "0.5rem 0 0",
    },
    filters: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
    },
    filterButton: {
      padding: "0.6rem 1.2rem",
      border: "2px solid #0066cc",
      background: "white",
      color: "#0066cc",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s",
    },
    activeFilter: {
      background: "#0066cc",
      color: "white",
    },
    tableContainer: {
      overflowX: "auto",
      marginBottom: "2rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "900px",
    },
    th: {
      background: "#f8f9fa",
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      color: "#003d7a",
      borderBottom: "2px solid #dee2e6",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #dee2e6",
    },
    statusBadge: {
      padding: "0.4rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "white",
      display: "inline-block",
      textTransform: "capitalize",
    },
    select: {
      padding: "0.5rem",
      borderRadius: "6px",
      border: "2px solid #dee2e6",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
    },
    deleteButton: {
      background: "#dc3545",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: "600",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      flexWrap: "wrap",
    },
    pageButton: {
      padding: "0.6rem 1rem",
      border: "2px solid #0066cc",
      background: "white",
      color: "#0066cc",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      minWidth: "40px",
    },
    activePageButton: {
      background: "#0066cc",
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
    },
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    fulfilled: bookings.filter((b) => b.status === "fulfilled").length,
    postponed: bookings.filter((b) => b.status === "postponed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <FaArrowLeft /> Back to Admin
        </button>
        <h2 style={styles.title}>Bookings & History</h2>
      </div>

      <div style={styles.stats}>
        <div style={{ ...styles.statCard, background: "#e3f2fd" }}>
          <p style={{ ...styles.statNumber, color: "#0066cc" }}>
            {stats.total}
          </p>
          <p style={styles.statLabel}>Total Bookings</p>
        </div>
        <div style={{ ...styles.statCard, background: "#fff9e6" }}>
          <p style={{ ...styles.statNumber, color: "#ffc107" }}>
            {stats.pending}
          </p>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{ ...styles.statCard, background: "#e8f5e9" }}>
          <p style={{ ...styles.statNumber, color: "#28a745" }}>
            {stats.fulfilled}
          </p>
          <p style={styles.statLabel}>Fulfilled</p>
        </div>
        <div style={{ ...styles.statCard, background: "#e0f7fa" }}>
          <p style={{ ...styles.statNumber, color: "#17a2b8" }}>
            {stats.postponed}
          </p>
          <p style={styles.statLabel}>Postponed</p>
        </div>
        <div style={{ ...styles.statCard, background: "#ffebee" }}>
          <p style={{ ...styles.statNumber, color: "#dc3545" }}>
            {stats.cancelled}
          </p>
          <p style={styles.statLabel}>Cancelled</p>
        </div>
      </div>

      <div style={styles.filters}>
        <button
          onClick={() => setFilterStatus("all")}
          style={{
            ...styles.filterButton,
            ...(filterStatus === "all" ? styles.activeFilter : {}),
          }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          style={{
            ...styles.filterButton,
            ...(filterStatus === "pending" ? styles.activeFilter : {}),
          }}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus("fulfilled")}
          style={{
            ...styles.filterButton,
            ...(filterStatus === "fulfilled" ? styles.activeFilter : {}),
          }}
        >
          Fulfilled ({stats.fulfilled})
        </button>
        <button
          onClick={() => setFilterStatus("postponed")}
          style={{
            ...styles.filterButton,
            ...(filterStatus === "postponed" ? styles.activeFilter : {}),
          }}
        >
          Postponed ({stats.postponed})
        </button>
        <button
          onClick={() => setFilterStatus("cancelled")}
          style={{
            ...styles.filterButton,
            ...(filterStatus === "cancelled" ? styles.activeFilter : {}),
          }}
        >
          Cancelled ({stats.cancelled})
        </button>
      </div>

      {currentBookings.length > 0 ? (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Client Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Service/Package</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={styles.td}>{booking.date}</td>
                    <td style={styles.td}>{booking.time}</td>
                    <td style={styles.td}>{booking.name}</td>
                    <td style={styles.td}>{booking.phone}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "600",
                          color: booking.service ? "#0066cc" : "#a02d6f",
                        }}
                      >
                        {booking.service ? "service" : "package"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {booking.service || booking.package || "N/A"}
                    </td>
                    <td style={styles.td}>{booking.address}</td>
                    <td style={styles.td}>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleUpdateStatus(booking.id, e.target.value)
                        }
                        style={{
                          ...styles.select,
                          borderColor: getStatusColor(booking.status),
                          color: getStatusColor(booking.status),
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="postponed">Postponed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  ...styles.pageButton,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        ...styles.pageButton,
                        ...(currentPage === pageNum
                          ? styles.activePageButton
                          : {}),
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 3 ||
                  pageNum === currentPage + 3
                ) {
                  return <span key={pageNum}>...</span>;
                }
                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  ...styles.pageButton,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={styles.emptyState}>
          <h3>No bookings found</h3>
          <p>
            Bookings will appear here once customers start making reservations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookings;
