import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const styles = {
    footer: {
      background: "linear-gradient(135deg, #001f3f 0%, #003d7a 100%)",
      color: "white",
      padding: "3rem 2rem 1rem",
      marginTop: "0",
      borderTop: "3px solid rgba(255, 255, 255, 0.2)",
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      marginBottom: "2rem",
    },
    section: {},
    heading: {
      marginBottom: "1rem",
      fontSize: "1.3rem",
      color: "white",
      fontWeight: "bold",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
    paragraph: {
      margin: "0.5rem 0",
      color: "rgba(255, 255, 255, 0.95)",
    },
    link: {
      color: "rgba(255, 255, 255, 0.95)",
      cursor: "pointer",
      textDecoration: "underline",
      transition: "opacity 0.3s",
    },
    bottom: {
      textAlign: "center",
      paddingTop: "2rem",
      borderTop: "1px solid rgba(255, 255, 255, 0.3)",
      color: "rgba(255, 255, 255, 0.9)",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p style={styles.paragraph}>📞 0768 323 230</p>
          <p style={styles.paragraph}>📱 0788 351 350</p>
          <p style={styles.paragraph}>📧 walkercleanersltd@gmail.com</p>
          <p style={styles.paragraph}>📍 Greec Towers Ruiru</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Follow Us</h4>
          <p style={styles.paragraph}>Instagram: @walkercleaners</p>
          <p style={styles.paragraph}>Facebook: walkercleaners</p>
          <p style={styles.paragraph}>Twitter: walkercleaners</p>
          <p style={styles.paragraph}>TikTok: walkercleaners</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <p style={styles.link} onClick={() => navigate("/track")}>
            Track Your Booking
          </p>
          <p style={styles.link} onClick={() => navigate("/book")}>
            Book a Service
          </p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; 2024 Walker Cleaners. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
