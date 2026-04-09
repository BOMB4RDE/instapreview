import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  const nextSlide = (e) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
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

      {isCarousel && (
        <>
          <div className="carousel-controls">
            {/* Bouton Gauche */}
            {currentIndex > 0 ? (
              <button 
                className="nav-btn left" 
                onClick={prevSlide}
                onPointerDown={(e) => e.stopPropagation()} 
              >
                ‹
              </button>
            ) : <div />} 

            {/* Bouton Droite */}
            {currentIndex < images.length - 1 ? (
              <button 
                className="nav-btn right" 
                onClick={nextSlide}
                onPointerDown={(e) => e.stopPropagation()}
              >
                ›
              </button>
            ) : <div />}
          </div>
          
          <div className="carousel-dots">
            {images.map((_, i) => (
              <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
