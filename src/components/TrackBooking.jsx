import React, { useState } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaCalendar,
  FaTimes,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { getBookings } from "../supabase";

const TrackBooking = () => {
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);

    try {
      const allBookings = await getBookings();

      const found = allBookings.filter(
        (b) => b.phone === phone || (bookingId && b.id === parseInt(bookingId))
      );

      if (found.length > 0) {
        setResult(found);
      } else {
        setResult({ notFound: true });
      }
    } catch (error) {
      console.error("Error searching bookings:", error.message, error);
      setResult({ notFound: true });
    } finally {
      setSearching(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock />;
      case "fulfilled":
        return <FaCheckCircle />;
      case "postponed":
        return <FaCalendar />;
      case "cancelled":
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #001f3f 0%, #003d7a 50%, #0066cc 100%)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    content: {
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "0 2rem",
    },
    card: {
      background: "linear-gradient(135deg, #0066cc 0%, #004d99 100%)",
      borderRadius: "16px",
      padding: "2.5rem",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
      border: "2px solid rgba(255, 255, 255, 0.1)",
    },
    title: {
      color: "white",
      fontSize: "2rem",
      marginBottom: "0.5rem",
      textAlign: "center",
      fontWeight: "bold",
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    input: {
      padding: "0.8rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      fontSize: "1rem",
      background: "rgba(255, 255, 255, 0.95)",
      boxSizing: "border-box",
    },
    divider: {
      textAlign: "center",
      color: "rgba(255, 255, 255, 0.7)",
      margin: "1rem 0",
      fontStyle: "italic",
    },
    button: {
      background: "white",
      color: "#0066cc",
      border: "none",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    resultCard: {
      marginTop: "2rem",
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      animation: "slideUp 0.4s ease-out",
    },
    bookingHeader: {
      color: "#003d7a",
      fontSize: "1.3rem",
      fontWeight: "700",
      marginBottom: "1rem",
      marginTop: 0,
      paddingBottom: "0.5rem",
      borderBottom: "2px solid #0066cc",
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.6rem 1.2rem",
      borderRadius: "20px",
      fontSize: "1rem",
      fontWeight: "600",
      color: "white",
      marginBottom: "1.5rem",
    },
    infoGrid: {
      display: "grid",
      gap: "1rem",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.8rem 0",
      borderBottom: "1px solid #e0e0e0",
    },
    label: {
      color: "#666",
      fontWeight: "600",
    },
    value: {
      color: "#003d7a",
      fontWeight: "500",
    },
    notFound: {
      textAlign: "center",
      padding: "2rem",
      color: "#dc3545",
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>Track Your Booking</h1>
          <p style={styles.subtitle}>
            Enter your phone number or booking ID to check status
          </p>

          <form style={styles.form} onSubmit={handleSearch}>
            <input
              type="tel"
              placeholder="Phone Number (e.g., +254 700 000 000)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />

            <div style={styles.divider}>- OR -</div>

            <input
              type="text"
              placeholder="Booking ID (e.g., 123456789)"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.button} disabled={searching}>
              <FaSearch /> {searching ? "Searching..." : "Track Booking"}
            </button>
          </form>

          {result && !result.notFound && Array.isArray(result) && (
            <>
              {result.map((booking, index) => (
                <div key={booking.id} style={styles.resultCard}>
                  <h3 style={styles.bookingHeader}>Booking #{index + 1}</h3>

                  <div
                    style={{
                      ...styles.statusBadge,
                      background: getStatusColor(booking.status),
                    }}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Booking ID:</span>
                      <span style={styles.value}>#{booking.id}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Service/Package:</span>
                      <span style={styles.value}>
                        {booking.service_or_package}
                      </span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Type:</span>
                      <span style={styles.value}>{booking.type}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Date:</span>
                      <span style={styles.value}>{booking.date}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Time:</span>
                      <span style={styles.value}>{booking.time}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Location:</span>
                      <span style={styles.value}>{booking.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {result && result.notFound && (
            <div style={styles.resultCard}>
              <div style={styles.notFound}>
                <h3>No booking found</h3>
                <p>
                  Please check your phone number or booking ID and try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackBooking;
