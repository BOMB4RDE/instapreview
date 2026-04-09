import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ÉTAT POUR LA LIGHTBOX (Ajouté)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de carrousel (CONSERVÉES À L'IDENTIQUE)
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

  // Fonction pour ouvrir la lightbox (Ajoutée)
  const openLightbox = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche le drag-and-drop
    setIsLightboxOpen(true);
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

        {/* --- ICÔNE LOUPE (Ajoutée) --- */}
        <div 
          className="zoom-icon" 
          onClick={openLightbox} // Ouvre la lightbox au clic
        >
          🔍
        </div>

        {/* CARROUSEL (CONSERVÉ À L'IDENTIQUE) */}
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

      {/* --- LIGHTBOX (Vue en grand) --- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)} // Ferme en cliquant sur le fond
          >
            {/* Croix de fermeture */}
            <button className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>×</button>
            
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
