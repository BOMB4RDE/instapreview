import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = Array.isArray(post.url) ? post.url : [post.url];

  const nextSlide = (e) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <>
      <div className="post-wrapper">
        {/* L'IMAGE DU FEED */}
        <img 
          src={images[currentIndex]} 
          className="media-content" 
          alt="" 
          draggable="false" 
        />

        {/* BOUTON ZOOM (Uniquement au survol via CSS) */}
        <div 
          className="zoom-icon" 
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
        >
          🔍 Agrandir
        </div>

        {/* CARROUSEL (On ne change rien au fonctionnement) */}
        {images.length > 1 && (
          <>
            <div className="carousel-controls">
              <button className="nav-btn left" onClick={prevSlide} style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}>‹</button>
              <button className="nav-btn right" onClick={nextSlide} style={{ visibility: currentIndex === images.length - 1 ? 'hidden' : 'visible' }}>›</button>
            </div>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* VUE EN GRAND */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="close-lightbox">×</button>
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
