import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Notification from "./Notification";
import { getServices, getPackages, saveBooking } from "../supabase";

// ─── Mpesa Payment Modal ──────────────────────────────────────────────────────
const MpesaModal = ({ booking, onSuccess, onCancel }) => {
  const [phone, setPhone] = useState(booking.phone || "");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("input"); // input | waiting | success | failed
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(null);

  useEffect(() => {
    return () => {
      if (polling) clearInterval(polling);
    };
  }, [polling]);

  const handlePay = async () => {
    setError("");

    if (!phone) return setError("Please enter your Mpesa phone number.");
    if (!amount || isNaN(amount) || Number(amount) < 1)
      return setError("Please enter a valid amount (minimum KES 1).");

    setStep("waiting");

    try {
      const response = await fetch("/api/mpesa?action=pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: Number(amount),
          bookingRef: `WC-${Date.now()}`,
          description: `Walker Cleaners - ${booking.service || booking.package}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to send payment prompt.");
        setStep("input");
        return;
      }

      setCheckoutRequestId(data.checkoutRequestId);

      // Poll for payment status every 5 seconds for up to 2 minutes
      let attempts = 0;
      const maxAttempts = 24;

      const interval = setInterval(async () => {
        attempts++;

        try {
          const queryRes = await fetch("/api/mpesa?action=query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutRequestId: data.checkoutRequestId }),
          });

          const queryData = await queryRes.json();

          if (queryData.paid) {
            clearInterval(interval);
            setPolling(null);
            setStep("success");
            // Save booking to Supabase after successful payment
            const saved = await saveBooking({
              ...booking,
              status: "paid",
              payment_method: "mpesa",
              amount_paid: Number(amount),
            });
            if (saved) {
              setTimeout(() => onSuccess(), 2000);
            }
          } else if (queryData.resultCode === "1032") {
            // User cancelled
            clearInterval(interval);
            setPolling(null);
            setStep("failed");
            setError("Payment was cancelled. Please try again.");
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setPolling(null);
            setStep("failed");
            setError(
              "Payment timed out. If you completed payment, your booking was saved.",
            );
            // Save booking as pending anyway so it's not lost
            await saveBooking({
              ...booking,
              status: "pending",
              payment_method: "mpesa_pending",
            });
          }
        } catch {
          // Keep polling even on network hiccup
        }
      }, 5000);

      setPolling(interval);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("input");
    }
  };

  const modalStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "1rem",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "2rem",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1rem",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
    marginTop: "0.4rem",
    outline: "none",
  };

  const greenBtn = {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #00a651, #007a3d)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "1.2rem",
    letterSpacing: "0.5px",
  };

  const ghostBtn = {
    width: "100%",
    padding: "0.8rem",
    background: "transparent",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "0.95rem",
    cursor: "pointer",
    marginTop: "0.8rem",
  };

  // ── Waiting screen ──────────────────────────────────────────────────────────
  if (step === "waiting") {
    return (
      <div style={modalStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📱</div>
          <h2 style={{ color: "#007a3d", marginBottom: "0.5rem" }}>
            Check Your Phone
          </h2>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            A payment prompt has been sent to <strong>{phone}</strong>.
            <br />
            Enter your <strong>Mpesa PIN</strong> to complete the payment of{" "}
            <strong>KES {amount}</strong>.
          </p>
          <div
            style={{ margin: "1.5rem 0", color: "#999", fontSize: "0.9rem" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e0e0e0",
                borderTop: "4px solid #00a651",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 0.8rem",
              }}
            />
            Waiting for payment confirmation...
          </div>
          <button
            onClick={() => {
              if (polling) clearInterval(polling);
              setStep("input");
            }}
            style={ghostBtn}
          >
            Cancel
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div style={modalStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ color: "#007a3d", marginBottom: "0.5rem" }}>
            Payment Successful!
          </h2>
          <p style={{ color: "#555" }}>
            Your booking has been confirmed. We'll be in touch shortly!
          </p>
        </div>
      </div>
    );
  }

  // ── Failed screen ───────────────────────────────────────────────────────────
  if (step === "failed") {
    return (
      <div style={modalStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
          <h2 style={{ color: "#c0392b", marginBottom: "0.5rem" }}>
            Payment Failed
          </h2>
          <p style={{ color: "#555", marginBottom: "1.5rem" }}>{error}</p>
          <button onClick={() => setStep("input")} style={greenBtn}>
            Try Again
          </button>
          <button onClick={onCancel} style={ghostBtn}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Input screen (default) ──────────────────────────────────────────────────
  return (
    <div style={modalStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #00a651, #007a3d)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
            }}
          >
            📲
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#111", fontSize: "1.3rem" }}>
              Pay with Mpesa
            </h2>
            <p style={{ margin: 0, color: "#777", fontSize: "0.85rem" }}>
              Lipa Na Mpesa — Secure & Instant
            </p>
          </div>
        </div>

        {/* Booking summary */}
        <div
          style={{
            background: "#f8fdf9",
            border: "1px solid #c8e6c9",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>
            Booking for
          </p>
          <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#222" }}>
            {booking.service || booking.package}
          </p>
          <p
            style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#777" }}
          >
            {booking.name} · {booking.date}
          </p>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{ fontWeight: "600", color: "#333", fontSize: "0.9rem" }}
          >
            Mpesa Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712 345 678"
            style={inputStyle}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label
            style={{ fontWeight: "600", color: "#333", fontSize: "0.9rem" }}
          >
            Amount (KES)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 2500"
            min="1"
            style={inputStyle}
          />
        </div>

        {error && (
          <p
            style={{
              color: "#c0392b",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </p>
        )}

        <button onClick={handlePay} style={greenBtn}>
          Send Payment Prompt →
        </button>
        <button onClick={onCancel} style={ghostBtn}>
          Back to booking
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#aaa",
            marginTop: "1rem",
          }}
        >
          🔒 Powered by Safaricom Daraja API
        </p>
      </div>
    </div>
  );
};

// ─── Main Booking Form ────────────────────────────────────────────────────────
const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const [formData, setFormData] = useState({
    type: searchParams.get("type") || "service",
    selectedOption: searchParams.get("name") || "",
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

  // ── Submit without payment (Book Now, Pay Later) ──────────────────────────
  const handleSubmitOnly = async (e) => {
    e.preventDefault();
    const bookingData = buildBookingData("pending");
    const success = await saveBooking(bookingData);
    if (success) setShowNotification(true);
    else alert("Failed to save booking. Please try again.");
  };

  // ── Submit and open Mpesa modal ───────────────────────────────────────────
  const handlePayNow = (e) => {
    e.preventDefault();
    const bookingData = buildBookingData("awaiting_payment");
    setPendingBooking(bookingData);
    setShowMpesa(true);
  };

  const buildBookingData = (status) => ({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    service: formData.type === "service" ? formData.selectedOption : "",
    package: formData.type === "package" ? formData.selectedOption : "",
    date: formData.date,
    time: formData.time,
    address: formData.address,
    message: formData.message,
    status,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    navigate("/");
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
      position: "relative",
    },
    homeButton: {
      position: "absolute",
      top: "1.5rem",
      right: "1.5rem",
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
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
    buttonRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
      marginTop: "1rem",
    },
    submitButton: {
      background: "rgba(255,255,255,0.15)",
      color: "white",
      border: "2px solid rgba(255,255,255,0.5)",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
    },
    payButton: {
      background: "linear-gradient(135deg, #00a651, #007a3d)",
      color: "white",
      border: "none",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,166,81,0.4)",
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
          <Link to="/" style={styles.homeButton}>
            ← Home
          </Link>

          <h1 style={styles.title}>Book a Service</h1>
          <p style={styles.subtitle}>
            Fill in the details below and we'll get back to you shortly
          </p>

          <form style={styles.form}>
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
                name="selectedOption"
                value={formData.selectedOption}
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

            {/* Two buttons: book only OR pay now */}
            <div style={styles.buttonRow}>
              <button
                type="submit"
                onClick={handleSubmitOnly}
                style={styles.submitButton}
              >
                Book Now, Pay Later
              </button>
              <button
                type="submit"
                onClick={handlePayNow}
                style={styles.payButton}
              >
                📲 Pay with Mpesa
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {showMpesa && pendingBooking && (
        <MpesaModal
          booking={pendingBooking}
          onSuccess={() => {
            setShowMpesa(false);
            setShowNotification(true);
          }}
          onCancel={() => setShowMpesa(false)}
        />
      )}

      {showNotification && (
        <Notification
          message="Your booking has been received! We'll be in touch shortly."
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default BookingForm;
