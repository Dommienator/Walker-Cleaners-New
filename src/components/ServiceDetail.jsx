import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { getServices } from "../supabase";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    const services = await getServices();
    const found = services.find((s) => s.id === parseInt(id));
    setService(found);
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1.5rem", color: "#0066cc" }}>Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1.5rem", color: "#666" }}>
          Service not found
        </div>
      </div>
    );
  }

  const images = service.images || [];

  const handleCall = () => {
    window.location.href = "tel:+254768323230";
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'd like to enquire about ${service.title}`
    );
    window.open(`https://wa.me/254768323230?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Enquiry about ${service.title}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to enquire about ${service.title}.\n\nThank you.`
    );
    window.location.href = `mailto:walkercleanersltd@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleBook = () => {
    navigate(
      `/book?type=service&id=${service.id}&name=${encodeURIComponent(
        service.title
      )}`
    );
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    content: {
      maxWidth: "1200px",
      margin: "3rem auto",
      padding: "0 2rem",
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
      marginBottom: "2rem",
      fontWeight: "600",
    },
    card: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    imageSection: {
      position: "relative",
      width: "100%",
      height: "400px",
      background: "linear-gradient(135deg, #0066cc 0%, #003d7a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    icon: {
      fontSize: "8rem",
      color: "white",
    },
    imageNav: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "12px",
    },
    dot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: "all 0.3s",
      border: "none",
      padding: 0,
    },
    activeDot: {
      background: "white",
      width: "36px",
      borderRadius: "6px",
    },
    detailsSection: {
      padding: "3rem",
    },
    title: {
      color: "#003d7a",
      fontSize: "2.5rem",
      marginBottom: "1rem",
    },
    description: {
      color: "#555",
      fontSize: "1.2rem",
      lineHeight: "1.8",
      marginBottom: "2rem",
    },
    actionsContainer: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      marginTop: "2rem",
    },
    bookButton: {
      background: "#0066cc",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    iconButton: {
      background: "none",
      border: "2px solid",
      cursor: "pointer",
      fontSize: "1.3rem",
      transition: "all 0.2s",
      padding: "0.8rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "55px",
      height: "55px",
    },
    phoneButton: {
      color: "#0066cc",
      borderColor: "#0066cc",
    },
    whatsappButton: {
      color: "#25D366",
      borderColor: "#25D366",
    },
    emailButton: {
      color: "#a02d6f",
      borderColor: "#a02d6f",
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Services
        </button>

        <div style={styles.card}>
          <div style={styles.imageSection}>
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={service.title}
                  style={styles.image}
                />
                {images.length > 1 && (
                  <div style={styles.imageNav}>
                    {images.map((_, index) => (
                      <button
                        key={index}
                        style={{
                          ...styles.dot,
                          ...(index === currentImageIndex
                            ? styles.activeDot
                            : {}),
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.icon}>{service.icon}</div>
            )}
          </div>

          <div style={styles.detailsSection}>
            <h1 style={styles.title}>{service.title}</h1>
            <p style={styles.description}>{service.description}</p>

            <div style={styles.actionsContainer}>
              <button onClick={handleBook} style={styles.bookButton}>
                <FaCalendarAlt /> Book This Service
              </button>

              <button
                onClick={handleCall}
                style={{ ...styles.iconButton, ...styles.phoneButton }}
                title="Call us"
              >
                <FaPhone />
              </button>
              <button
                onClick={handleWhatsApp}
                style={{ ...styles.iconButton, ...styles.whatsappButton }}
                title="WhatsApp"
              >
                <FaWhatsapp />
              </button>
              <button
                onClick={handleEmail}
                style={{ ...styles.iconButton, ...styles.emailButton }}
                title="Email us"
              >
                <FaEnvelope />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
