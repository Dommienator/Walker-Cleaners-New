import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ServiceCard from "./components/ServiceCard";
import PackageCard from "./components/PackageCard";
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import BookingForm from "./components/BookingForm";
import ServiceDetail from "./components/ServiceDetail";
import PackageDetail from "./components/PackageDetail";
import TrackBooking from "./components/TrackBooking";
import { getServices, getPackages } from "./supabase";

function HomePage() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log("Loading data from Supabase...");
    setLoading(true);

    try {
      const servicesData = await getServices();
      console.log("Services loaded:", servicesData);
      console.log("Services count:", servicesData?.length || 0);

      const packagesData = await getPackages();
      console.log("Packages loaded:", packagesData);
      console.log("Packages count:", packagesData?.length || 0);

      setServices(servicesData || []);
      setPackages(packagesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setServices([]);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    app: {
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      background: "#f5f5f5",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    section: {
      padding: "2rem 0",
    },
    packagesSection: {
      padding: "2rem 0",
      background: "white",
    },
    sectionTitle: {
      fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
      color: "#003d7a",
      textAlign: "center",
      marginBottom: "2rem",
      fontWeight: "bold",
      padding: "0 1rem",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      padding: "0 0.5rem",
    },
    packagesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 0.5rem",
    },
    loading: {
      textAlign: "center",
      padding: "2rem",
      fontSize: "1.1rem",
      color: "#0066cc",
    },
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <Header />
        <div style={styles.loading}>Loading services and packages...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Header />

      <section id="services" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Services</h2>
          {services.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No services found.
            </p>
          ) : (
            <div style={styles.servicesGrid}>
              {services.map((service) => (
                <div key={service.id} id={`service-${service.id}`}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="packages" style={styles.packagesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Service Packages</h2>
          {packages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No packages available. Please add packages from the admin panel.
            </p>
          ) : (
            <div style={styles.packagesGrid}>
              {packages.map((pkg) => (
                <div key={pkg.id} id={`package-${pkg.id}`}>
                  <PackageCard package={pkg} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/track" element={<TrackBooking />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/package/:id" element={<PackageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
