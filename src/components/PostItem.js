import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post, onZoom }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  return (
    <div 
      className="post-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          className="media-content"
          draggable="false"
        />
      </AnimatePresence>

      {/* Clique ici envoie l'URL vers App.js */}
      {isHovered && (
        <div 
          className="zoom-icon" 
          onClick={(e) => {
            e.stopPropagation();
            onZoom(images[currentIndex]);
          }}
        >
          🔍
        </div>
      )}

      {/* Garde ton code de carrousel intact ici... */}
      {isCarousel && (
        <div className="carousel-dots">
          {images.map((_, i) => (
            <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  );
}
