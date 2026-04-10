import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); 
  
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
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </AnimatePresence>

        {/* LOUPE : On utilise onPointerDown pour court-circuiter le drag */}
        {isHovered && (
          <div 
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsLightboxOpen(true); }}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              backgroundColor: 'white', color: 'black', padding: '6px 10px',
              borderRadius: '6px', fontSize: '18px', cursor: 'pointer',
              zIndex: 999, display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              fontWeight: 'bold'
            }}
          >
            🔍
          </div>
        )}

        {/* CARROUSEL : Version originale qui fonctionne */}
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

      {/* LIGHTBOX : On la force en mode "PORTAL" visuel */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 999999, cursor: 'zoom-out'
            }}
          >
            <div 
                onClick={() => setIsLightboxOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '50px', fontWeight: 'bold', cursor: 'pointer', zIndex: 1000000 }}
            >
                ×
            </div>
            <motion.img 
              src={images[currentIndex]} 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }}
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
