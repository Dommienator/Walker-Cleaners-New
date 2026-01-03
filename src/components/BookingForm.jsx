import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Notification from "./Notification";
import { getServices, getPackages, saveBooking } from "../supabase";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    type: searchParams.get("type") || "service",
    serviceOrPackage: searchParams.get("name") || "",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    address: "",
    message: "",
  });
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const servicesData = await getServices();
    const packagesData = await getPackages();
    setServices(servicesData);
    setPackages(packagesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveBooking(formData);
    if (success) {
      setShowNotification(true);
    } else {
      alert("Failed to save booking. Please try again.");
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #001f3f 0%, #003d7a 50%, #0066cc 100%)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    formSection: {
      maxWidth: "800px",
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
      gap: "1.5rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      color: "white",
      fontWeight: "600",
      fontSize: "0.95rem",
    },
    input: {
      padding: "0.8rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      fontSize: "1rem",
      transition: "border-color 0.3s",
      boxSizing: "border-box",
      background: "rgba(255, 255, 255, 0.95)",
    },
    select: {
      padding: "0.8rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      fontSize: "1rem",
      background: "rgba(255, 255, 255, 0.95)",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    textarea: {
      padding: "0.8rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      fontSize: "1rem",
      minHeight: "100px",
      fontFamily: "inherit",
      resize: "vertical",
      boxSizing: "border-box",
      background: "rgba(255, 255, 255, 0.95)",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    submitButton: {
      background: "white",
      color: "#0066cc",
      border: "none",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      marginTop: "1rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    required: {
      color: "#ffeb3b",
    },
  };

  const options = formData.type === "service" ? services : packages;

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.formSection}>
        <div style={styles.card}>
          <h1 style={styles.title}>Book a Service</h1>
          <p style={styles.subtitle}>
            Fill in the details below and we'll get back to you shortly
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                I want to book a <span style={styles.required}>*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="service">Service</option>
                <option value="package">Package</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Select {formData.type === "service" ? "Service" : "Package"}{" "}
                <span style={styles.required}>*</span>
              </label>
              <select
                name="serviceOrPackage"
                value={formData.serviceOrPackage}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">-- Select --</option>
                {options.map((option) => (
                  <option key={option.id} value={option.title}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Full Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Phone Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="+254 700 000 000"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="john@example.com"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Preferred Date <span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={styles.input}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Preferred Time <span style={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Address/Location <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your address"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Additional Information</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Any special requirements or additional details..."
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
      <Footer />

      {showNotification && (
        <Notification
          message="You will receive confirmation from our team shortly."
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default BookingForm;
