import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); 
  
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de carrousel (stable backup)
  const nextSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // --- NOUVELLE FONCTION POUR OUVRIR LA LIGHTBOX ---
  const handleZoomClick = (e) => {
    // Empêche ABSOLUMENT le drag-and-drop de s'activer
    e.preventDefault();
    e.stopPropagation(); 
    
    // Ouvre la vue en grand
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div 
        className="post-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            className="media-content"
            draggable="false"
          />
        </AnimatePresence>

        {/* --- LOUPE CORRIGÉE (Clic Forcé) --- */}
        {isHovered && (
          <div 
            // data-no-drag dit à Framer Motion : "Ne me drag pas si on clique ici"
            data-no-drag="true"
            // onPointerDown est déclenché AVANT le début du drag
            onPointerDown={handleZoomClick} 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'white',
              color: 'black',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              zIndex: 999, // Devant tout
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              fontWeight: 'bold',
              pointerEvents: 'auto' // Force la détection du clic
            }}
          >
            🔍
          </div>
        )}

        {/* CARROUSEL STABLE */}
        {isCarousel && (
          <>
            <div className="carousel-controls">
              <button className="nav-btn" style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }} onPointerDown={prevSlide}>‹</button>
              <button className="nav-btn" style={{ visibility: currentIndex === images.length - 1 ? 'hidden' : 'visible' }} onPointerDown={nextSlide}>›</button>
            </div>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- LIGHTBOX (Vue en grand) --- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Clique sur le fond pour fermer
            onClick={() => setIsLightboxOpen(false)} 
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10000, cursor: 'zoom-out'
            }}
          >
            {/* Croix de fermeture (en haut à droite) */}
            <button 
                className="close-lightbox" 
                onClick={() => setIsLightboxOpen(false)}
                style={{
                    position: 'absolute', top: '20px', right: '20px', color: 'white',
                    fontSize: '50px', background: 'none', border: 'none', cursor: 'pointer',
                    fontWeight: 'bold', lineheight: 1, zIndex: 10001
                }}
            >
                ×
            </button>
            
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              // Empêche la fermeture si on clique sur l'image elle-même
              onClick={(e) => e.stopPropagation()} 
              style={{
                  maxWidth: '90%', maxHeight: '85vh', borderRadius: '8px',
                  boxShadow: '0 0 40px rgba(0,0,0,0.6)', cursor: 'default'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
