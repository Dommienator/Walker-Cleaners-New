import React, { useState, useEffect } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = service.images && Array.isArray(service.images) ? service.images : [];

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
    const message = encodeURIComponent(`Hi, I'd like to enquire about ${service.title}`);
    window.open(`https://wa.me/254768323230?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Enquiry about ${service.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to enquire about ${service.title}.\n\nThank you.`);
    window.location.href = `mailto:walkercleanersltd@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleBook = () => {
    navigate(`/book?type=service&id=${service.id}&name=${encodeURIComponent(service.title)}`);
  };

  const handleViewDetails = () => {
    navigate(`/service/${service.id}`);
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
      height: '200px',
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
    icon: {
      fontSize: '4rem',
      color: 'white'
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
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      flexGrow: 1,
      background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)'
    },
    title: {
      color: 'white',
      fontSize: '1.5rem',
      textAlign: 'center',
      margin: 0,
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
    },
    description: {
      color: 'rgba(255, 255, 255, 0.95)',
      lineHeight: '1.6',
      flexGrow: 1,
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
      width: '100%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    contactButtons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
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
              alt={service.title} 
              style={styles.image}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<div style="font-size: 4rem; color: white;">${service.icon}</div>`;
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
        ) : (
          <div style={styles.icon}>{service.icon}</div>
        )}
      </div>
      <div style={styles.content}>
        <h3 style={styles.title} onClick={handleViewDetails}>{service.title}</h3>
        <p style={styles.description}>{service.description}</p>
        <button onClick={handleBook} style={styles.bookButton}>
          <FaCalendarAlt /> Book This Service
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

export default ServiceCard;