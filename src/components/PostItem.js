import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post, onZoom }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = Array.isArray(post.url) ? post.url : [post.url];

  const nextSlide = (e) => { e.preventDefault(); e.stopPropagation(); if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1); };
  const prevSlide = (e) => { e.preventDefault(); e.stopPropagation(); if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  return (
    <div 
      className="post-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img key={images[currentIndex]} src={images[currentIndex]} className="media-content" draggable="false" />
      </AnimatePresence>

      {isHovered && (
        <div 
          data-no-drag="true"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onZoom(images[currentIndex]); }}
          style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', color: 'black', padding: '6px 10px', borderRadius: '6px', fontSize: '18px', cursor: 'pointer', zIndex: 999 }}
        >🔍</div>
      )}

      {images.length > 1 && (
        <div className="carousel-controls">
          <button className="nav-btn" style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }} onPointerDown={prevSlide}>‹</button>
          <button className="nav-btn" style={{ visibility: currentIndex === images.length - 1 ? 'hidden' : 'visible' }} onPointerDown={nextSlide}>›</button>
        </div>
      )}
    </div>
  );
}
