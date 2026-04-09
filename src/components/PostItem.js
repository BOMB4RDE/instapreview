import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de navigation (On garde ta version BACKUP qui fonctionne)
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

  return (
    <>
      <div className="post-wrapper">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="media-content"
            draggable="false"
          />
        </AnimatePresence>

        {/* BOUTON LOUPE (Placé ici pour être au-dessus de l'image) */}
        <div 
          className="zoom-icon" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Bloque le drag pour ne pas déplacer le post
            setIsLightboxOpen(true);
          }}
        >
          🔍
        </div>

        {/* CARROUSEL (Flèches et Points - Version BACKUP) */}
        {isCarousel && (
          <>
            <div className="carousel-controls">
              <button 
                className="nav-btn" 
                style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                onPointerDown={prevSlide}
              >
                ‹
              </button>
              <button 
                className="nav-btn" 
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

      {/* VUE EN GRAND (LIGHTBOX) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>×</button>
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
