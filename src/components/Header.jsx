import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Header = () => {
  const [logoImage, setLogoImage] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showPackagesDropdown, setShowPackagesDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
    loadServicesAndPackages();
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
              setCurrentSlide(0);
            }
          } catch {
            setSlides([settings.header_image]);
            setCurrentSlide(0);
          }
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const loadServicesAndPackages = async () => {
    try {
      const { data: servicesData } = await supabase
        .from("services")
        .select("id, title")
        .order("id", { ascending: true });

      const { data: packagesData } = await supabase
        .from("packages")
        .select("id, title")
        .order("id", { ascending: true });

      setServices(servicesData || []);
      setPackages(packagesData || []);
    } catch (error) {
      console.error("Error loading services/packages:", error);
    }
  };

  const styles = {
    header: {
      position: "relative",
      height: "600px",
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
        "linear-gradient(135deg, rgba(0, 61, 122, 0.25) 0%, rgba(0, 102, 204, 0.25) 100%)",
      zIndex: 2,
    },
    nav: {
      position: "absolute",
      top: "0.1 rem",
      left: 0,
      right: 0,
      zIndex: 3,
      padding: "0",
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
      alignItems: "center",
    },
    logo: {
      height: "80px",
      width: "auto",
      objectFit: "contain",
    },
    navLinks: {
      display: "flex",
      gap: "2.5rem",
      alignItems: "center",
    },
    navLinkWrapper: {
      position: "relative",
      zIndex: 100000,
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "700",
      textTransform: "uppercase",
      transition: "opacity 0.2s",
      cursor: "pointer",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "0",
      paddingTop: "0.5rem",
      background: "transparent",
      minWidth: "220px",
      zIndex: 99999,
    },
    dropdownContent: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      overflow: "hidden",
    },
    dropdownItem: {
      padding: "0.8rem 1.2rem",
      color: "#333",
      textDecoration: "none",
      display: "block",
      cursor: "pointer",
      borderBottom: "1px solid #f0f0f0",
      fontSize: "0.95rem",
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
      position: "absolute",
      top: "60%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      textAlign: "center",
      color: "white",
      padding: "2rem",
      maxWidth: "800px",
      width: "100%",
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

  const scrollToItem = (itemId, type) => {
    // First navigate to home page if not already there
    if (window.location.pathname !== "/") {
      navigate("/");
      // Wait for navigation and DOM to update
      setTimeout(() => {
        const element = document.getElementById(`${type}-${itemId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add a highlight effect
          element.style.animation = "highlight 2s ease-in-out";
        }
      }, 300);
    } else {
      const element = document.getElementById(`${type}-${itemId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add a highlight effect
        element.style.animation = "highlight 2s ease-in-out";
      }
    }
  };

  return (
    <header style={styles.header}>
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

      <div style={styles.overlay} />

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
          </Link>

          <nav style={styles.navLinks}>
            <div
              style={styles.navLinkWrapper}
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
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
              {showServicesDropdown && services.length > 0 && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownContent}>
                    {services.map((service) => (
                      <a
                        key={service.id}
                        href="#services"
                        style={styles.dropdownItem}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToItem(service.id, "service");
                          setShowServicesDropdown(false);
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = "#f5f5f5")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "white")
                        }
                      >
                        {service.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              style={styles.navLinkWrapper}
              onMouseEnter={() => setShowPackagesDropdown(true)}
              onMouseLeave={() => setShowPackagesDropdown(false)}
            >
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
              {showPackagesDropdown && packages.length > 0 && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownContent}>
                    {packages.map((pkg) => (
                      <a
                        key={pkg.id}
                        href="#packages"
                        style={styles.dropdownItem}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToItem(pkg.id, "package");
                          setShowPackagesDropdown(false);
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = "#f5f5f5")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "white")
                        }
                      >
                        {pkg.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>Walker Cleaners</h1>
        <p style={styles.heroSubtitle}>Your Mess is our Mission</p>
      </div>

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
