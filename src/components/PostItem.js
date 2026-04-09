import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const images = Array.isArray(post.url) ? post.url : [post.url];

  return (
    <>
      <div className="post-wrapper" onClick={() => setIsOpen(true)}>
        <img src={images[currentIndex]} className="media-content" draggable="false" alt="" />
        {images.length > 1 && <div className="carousel-indicator">❐</div>}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setIsOpen(false)}
          >
            <button className="close-lightbox">×</button>
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={images[currentIndex]} 
              className="lightbox-content" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
