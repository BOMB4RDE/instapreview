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
        style={{ position: 'relative', zIndex: isLightboxOpen ? 10000 : 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            className="media-content"
            draggable="false"
          />
        </AnimatePresence>

        {/* LOUPE */}
        {isHovered && !isLightboxOpen && (
          <div 
            data-no-drag="true"
            onPointerDown={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              setIsLightboxOpen(true); 
            }} 
            style={{
              position: 'absolute', top: '10px', right: '10px',
              backgroundColor: 'white', color: 'black', padding: '6px 10px',
              borderRadius: '6px', fontSize: '18px', cursor: 'pointer',
              zIndex: 999, display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              fontWeight: 'bold', pointerEvents: 'auto'
            }}
          >
            🔍
          </div>
        )}

        {/* CARROUSEL */}
        {isCarousel && !isLightboxOpen && (
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

      {/* --- LIGHTBOX (Vue en grand - Sortie de la grille) --- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100vw', height: '100vh',
                backgroundColor: 'black', // Opaque pour cacher le bug
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 999999, // Priorité absolue
                cursor: 'default',
                pointerEvents: 'all' // Capture TOUS les clics
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
          >
            {/* CROIX DE FERMETURE SÉCURISÉE */}
            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              style={{
                  position: 'absolute', top: '20px', right: '20px',
                  color: 'white', fontSize: '60px', fontWeight: 'bold',
                  cursor: 'pointer', zIndex: 1000000,
                  width: '60px', height: '60px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)', borderRadius: '50%'
              }}
            >
              ×
            </div>
            
            <motion.img 
              src={images[currentIndex]} 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()} 
              style={{
                  maxWidth: '95%', maxHeight: '95%',
                  objectFit: 'contain',
                  boxShadow: '0 0 50px rgba(0,0,0,1)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
