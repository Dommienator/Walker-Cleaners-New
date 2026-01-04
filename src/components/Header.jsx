import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

const Header = () => {
  const [logoImage, setLogoImage] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const loadSettings = async () => {
    try {
      const { data } = await supabase.from("settings").select("*").limit(1);

      if (data && data.length > 0) {
        const settings = data[0];

        if (settings.logo_image) {
          setLogoImage(settings.logo_image);
        }

        if (settings.header_image) {
          try {
            const images = JSON.parse(settings.header_image);
            if (Array.isArray(images) && images.length > 0) {
              setSlides(images);
            }
          } catch {
            // If not JSON, use as single image
            setSlides([settings.header_image]);
          }
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const styles = {
    header: {
      position: "relative",
      height: "500px",
      overflow: "hidden",
    },
    slideshow: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    slide: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "opacity 1s ease-in-out",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(135deg, rgba(0, 61, 122, 0.85) 0%, rgba(0, 102, 204, 0.85) 100%)",
      zIndex: 2,
    },
    nav: {
      position: "relative",
      zIndex: 3,
      padding: "1.5rem 0",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoLink: {
      textDecoration: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.3rem",
    },
    logo: {
      height: "60px",
      width: "auto",
      objectFit: "contain",
    },
    companyName: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "white",
      margin: 0,
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    },
    navLinks: {
      display: "flex",
      gap: "2.5rem",
      alignItems: "center",
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "600",
      transition: "opacity 0.2s",
      cursor: "pointer",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
    button: {
      background: "white",
      color: "#0066cc",
      padding: "0.9rem 2rem",
      borderRadius: "30px",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "700",
      transition: "all 0.3s",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    heroContent: {
      position: "relative",
      zIndex: 3,
      textAlign: "center",
      color: "white",
      padding: "4rem 2rem",
      maxWidth: "800px",
      margin: "0 auto",
    },
    heroTitle: {
      fontSize: "3.5rem",
      fontWeight: "800",
      marginBottom: "1rem",
      textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
      lineHeight: "1.2",
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      fontWeight: "400",
      opacity: 0.95,
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    },
    dots: {
      position: "absolute",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "12px",
      zIndex: 3,
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
      transform: "scale(1.3)",
    },
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header style={styles.header}>
      {/* Slideshow Background */}
      <div style={styles.slideshow}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              backgroundImage: `url(${slide})`,
              opacity: currentSlide === index ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div style={styles.overlay} />

      {/* Navigation */}
      <div style={styles.nav}>
        <div style={styles.container}>
          <Link to="/" style={styles.logoLink}>
            {logoImage && (
              <img
                src={logoImage}
                alt="Walker Cleaners Logo"
                style={styles.logo}
              />
            )}
            <span style={styles.companyName}>Walker Cleaners</span>
          </Link>

          <nav style={styles.navLinks}>
            <a
              href="#services"
              style={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("services");
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.7")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Services
            </a>
            <a
              href="#packages"
              style={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("packages");
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.7")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Packages
            </a>
            <a
              href="https://walkercleaners.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.navLink}
              onMouseOver={(e) => (e.target.style.opacity = "0.7")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Blog
            </a>
            <Link
              to="/book"
              style={styles.button}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              Book Now
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Content */}
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>Professional Cleaning Services</h1>
        <p style={styles.heroSubtitle}>Your Mess is our Mission</p>
      </div>

      {/* Slideshow Dots */}
      <div style={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            style={{
              ...styles.dot,
              ...(currentSlide === index ? styles.activeDot : {}),
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
