import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de carrousel (on n'y touche plus)
  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fonction pour ouvrir la lightbox (uniquement via l'icône)
  const openLightbox = (e) => {
    e.stopPropagation(); // Empêche d'autres actions
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="post-wrapper" style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="media-content"
            draggable="false"
            // Le clic sur l'image ne fait plus rien
          />
        </AnimatePresence>

        {/* --- ICÔNE DE ZOOM (Apparaît au survol) --- */}
        <div className="zoom-icon" onClick={openLightbox}>
          🔍 {/* Tu peux remplacer par une icône SVG si tu préfères */}
        </div>

        {/* CAROUSEL CONTROLS (On n'y touche plus) */}
        {isCarousel && (
          <>
            <div className="carousel-controls">
              <button 
                className="nav-btn left" 
                style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                onPointerDown={prevSlide}
              >
                ‹
              </button>
              <button 
                className="nav-btn right" 
                style={{ visibility: currentIndex === images.length - 1 ? 'hidden' : 'visible' }}
                onPointerDown={nextSlide}
              >
                ›
              </button>
            </div>
            
            <div className="carousel-dots">
              {images.map((_, i) => (
                <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* LIGHTBOX (Vue en grand) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)} // Ferme en cliquant sur le fond
          >
            {/* Croix de fermeture */}
            <button className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>×</button>
            
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={images[currentIndex]} 
              className="lightbox-content" 
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
