import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-in-out'
    },
    notification: {
      background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)',
      color: 'white',
      padding: '2.5rem 3rem',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      animation: 'slideUp 0.4s ease-out',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    },
    iconContainer: {
      marginBottom: '1.5rem'
    },
    icon: {
      fontSize: '4rem',
      color: '#4CAF50',
      animation: 'scaleIn 0.5s ease-out',
      filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
    },
    message: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      opacity: 0.95,
      marginBottom: '2rem'
    },
    button: {
      background: 'white',
      color: '#0066cc',
      border: 'none',
      padding: '0.8rem 2rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '4px',
      background: 'rgba(255, 255, 255, 0.3)',
      width: '100%',
      borderRadius: '0 0 14px 14px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'white',
      animation: 'progress 5s linear',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
    }
  };

  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes scaleIn {
      0% { 
        transform: scale(0);
        opacity: 0;
      }
      50% { 
        transform: scale(1.2);
      }
      100% { 
        transform: scale(1);
        opacity: 1;
      }
    }
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.notification} onClick={(e) => e.stopPropagation()}>
          <div style={styles.iconContainer}>
            <FaCheckCircle style={styles.icon} />
          </div>
          <h2 style={styles.title}>Booking Requested!</h2>
          <p style={styles.message}>{message}</p>
          <button style={styles.button} onClick={onClose}>
            Got it, thanks!
          </button>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;