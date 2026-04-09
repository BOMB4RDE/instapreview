import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCarousel = Array.isArray(post.url) && post.url.length > 1;

  const nextSlide = (e) => {
    e.stopPropagation();
    if (currentIndex < post.url.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="post-wrapper">
      <AnimatePresence mode="wait">
        <motion.img
          key={isCarousel ? post.url[currentIndex] : post.url}
          src={isCarousel ? post.url[currentIndex] : post.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="media-content"
        />
      </AnimatePresence>

      {isCarousel && (
        <>
          <div className="carousel-controls">
            {currentIndex > 0 && <button onClick={prevSlide} className="nav-btn left">‹</button>}
            {currentIndex < post.url.length - 1 && <button onClick={nextSlide} className="nav-btn right">›</button>}
          </div>
          <div className="carousel-dots">
            {post.url.map((_, i) => (
              <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
