import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); // On gère le survol en JS
  
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  const nextSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
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

        {/* --- LOUPE FORCÉE EN JAVASCRIPT --- */}
        {isHovered && (
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Bloque le drag pour l'agrandissement
              setIsLightboxOpen(true);
            }}
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
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              fontWeight: 'bold'
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

      {/* LIGHTBOX */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10000, cursor: 'zoom-out'
            }}
          >
            <button 
                className="close-lightbox" 
                onClick={() => setIsLightboxOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                ×
            </button>
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: '90%', maxHeight: '85vh', borderRadius: '8px', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
