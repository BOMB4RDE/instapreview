import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

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
              <div 
                key={i} 
                className={`dot ${i === currentIndex ? 'active' : ''}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
