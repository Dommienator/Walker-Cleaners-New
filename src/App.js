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
import { getServices, getPackages, migrateDefaultData } from "./supabase";

function HomePage() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Ensure default data is migrated
      await migrateDefaultData();

      // Load data from Supabase
      const servicesData = await getServices();
      const packagesData = await getPackages();

      setServices(servicesData);
      setPackages(packagesData);
    } catch (error) {
      console.error("Error loading data:", error);
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
      padding: "0 2rem",
    },
    section: {
      padding: "4rem 0",
    },
    packagesSection: {
      padding: "4rem 0",
      background: "white",
    },
    sectionTitle: {
      fontSize: "2.5rem",
      color: "#003d7a",
      textAlign: "center",
      marginBottom: "3rem",
      fontWeight: "bold",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
    },
    packagesGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
      maxWidth: "900px",
      margin: "0 auto",
    },
    loading: {
      textAlign: "center",
      padding: "4rem",
      fontSize: "1.2rem",
      color: "#0066cc",
    },
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <Header />
        <div style={styles.loading}>Loading...</div>
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
              No services available yet.
            </p>
          ) : (
            <div style={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
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
              No packages available yet.
            </p>
          ) : (
            <div style={styles.packagesGrid}>
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
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
