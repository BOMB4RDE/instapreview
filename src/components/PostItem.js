import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // État pour la vue en grand
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de carrousel (restaurées)
  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Bloque le drag
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Bloque le drag
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      {/* POST WRAPPER - RESTAURÉ (avec gestion du clic centre) */}
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
            // CLIC CENTRE : Ouvre la lightbox
            onClick={() => setIsLightboxOpen(true)}
          />
        </AnimatePresence>

        {/* CAROUSEL CONTROLS - RESTAURÉS (avec onPointerDown) */}
        {isCarousel && (
          <>
            <div className="carousel-controls">
              <button 
                className="nav-btn left" 
                style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                onPointerDown={prevSlide} //onPointerDown pour court-circuiter le drag
              >
                ‹
              </button>
              <button 
                className="nav-btn right" 
                style={{ visibility: currentIndex === images.length - 1 ? 'hidden' : 'visible' }}
                onPointerDown={nextSlide} //onPointerDown pour court-circuiter le drag
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

      {/* LIGHTBOX (Ajoutée) */}
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
