import React, { useState, useEffect } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ package: pkg }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = pkg.images && Array.isArray(pkg.images) ? pkg.images : [];

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const handleCall = () => {
    window.location.href = 'tel:+254768323230';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'd like to enquire about ${pkg.title}`);
    window.open(`https://wa.me/254768323230?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Enquiry about ${pkg.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to enquire about ${pkg.title}.\n\nThank you.`);
    window.location.href = `mailto:walkercleanersltd@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleBook = () => {
    navigate(`/book?type=package&id=${pkg.id}&name=${encodeURIComponent(pkg.title)}`);
  };

  const handleViewDetails = () => {
    navigate(`/package/${pkg.id}`);
  };

  const styles = {
    card: {
      background: 'linear-gradient(135deg, #0066cc 0%, #003d7a 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: isHovered ? '0 12px 24px rgba(0, 102, 204, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s',
      display: 'flex',
      flexDirection: 'column',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      cursor: 'pointer',
      border: '2px solid rgba(255, 255, 255, 0.1)'
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '250px',
      background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    imageNav: {
      position: 'absolute',
      bottom: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      zIndex: 10,
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '20px',
      backdropFilter: 'blur(4px)'
    },
    dot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '2px solid transparent',
      padding: 0
    },
    activeDot: {
      background: 'white',
      transform: 'scale(1.2)',
      border: '2px solid rgba(0, 102, 204, 0.8)'
    },
    content: {
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)'
    },
    title: {
      color: 'white',
      fontSize: '1.8rem',
      margin: 0,
      fontStyle: 'italic',
      textAlign: 'center',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
    },
    includesSection: {
      background: 'rgba(255, 255, 255, 0.15)',
      padding: '1rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    },
    includesTitle: {
      color: 'white',
      marginBottom: '0.5rem',
      fontSize: '1.1rem',
      fontWeight: 'bold'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '0.3rem 0',
      paddingLeft: '1.5rem',
      position: 'relative',
      color: 'rgba(255, 255, 255, 0.95)'
    },
    bullet: {
      position: 'absolute',
      left: 0,
      color: 'white'
    },
    description: {
      color: 'rgba(255, 255, 255, 0.95)',
      lineHeight: '1.6',
      fontStyle: 'italic',
      textAlign: 'center'
    },
    bookButton: {
      background: 'white',
      color: '#0066cc',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    contactButtons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem'
    },
    iconButton: {
      background: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'all 0.2s',
      padding: '0.6rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '45px',
      height: '45px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    phoneButton: {
      color: '#0066cc'
    },
    whatsappButton: {
      color: '#25D366'
    },
    emailButton: {
      color: '#a02d6f'
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer} onClick={handleViewDetails}>
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={pkg.title} 
              style={styles.image}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {images.length > 1 && (
              <div style={styles.imageNav}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.dot,
                      ...(index === currentImageIndex ? styles.activeDot : {})
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <div style={styles.content}>
        <h3 style={styles.title} onClick={handleViewDetails}>{pkg.title}</h3>
        <div style={styles.includesSection}>
          <h4 style={styles.includesTitle}>Includes:</h4>
          <ul style={styles.list}>
            {pkg.includes.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.bullet}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p style={styles.description}>{pkg.description}</p>
        <button onClick={handleBook} style={styles.bookButton}>
          <FaCalendarAlt /> Book This Package
        </button>
        <div style={styles.contactButtons}>
          <button 
            onClick={handleCall} 
            style={{...styles.iconButton, ...styles.phoneButton}}
            title="Call us"
          >
            <FaPhone />
          </button>
          <button 
            onClick={handleWhatsApp} 
            style={{...styles.iconButton, ...styles.whatsappButton}}
            title="WhatsApp"
          >
            <FaWhatsapp />
          </button>
          <button 
            onClick={handleEmail} 
            style={{...styles.iconButton, ...styles.emailButton}}
            title="Email us"
          >
            <FaEnvelope />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;