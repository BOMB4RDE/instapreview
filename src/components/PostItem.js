import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostItem({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); 
  
  const images = Array.isArray(post.url) ? post.url : [post.url];
  const isCarousel = images.length > 1;

  // Fonctions de carrousel (stable backup)
  const nextSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // --- FONCTION DE FERMETURE (Corrigée) ---
  const closeLightbox = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Crucial pour ne pas cliquer sur le feed derrière
    }
    setIsLightboxOpen(false);
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

        {/* LOUPE STABLE */}
        {isHovered && (
          <div 
            data-no-drag="true"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsLightboxOpen(true); }} 
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

      {/* --- LIGHTBOX (Vue en grand - Adaptée à Notion) --- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Clique sur le fond pour fermer
            onClick={closeLightbox} 
            style={{
                // Remplit tout le bloc du widget Notion proprement
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.98)', // Fond très sombre pour masquer le feed
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000, // Par-dessus tout dans le widget
                cursor: 'zoom-out',
                pointerEvents: 'auto' // Pour capturer le clic de fermeture
            }}
          >
            {/* --- CROIX DE FERMETURE (Positionnée en haut à droite DU WIDGET) --- */}
            <div 
              onClick={closeLightbox} // Clic sur le div de la croix pour fermer
              style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  color: 'white',
                  fontSize: '50px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  lineHeight: '1',
                  padding: '0 10px',
                  zIndex: 10002, // Devant l'image agrandie
                  // Petite astuce pour s'assurer que Notion ne l'intercepte pas
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
              }}
            >
              ×
            </div>
            
            <motion.img 
              src={images[currentIndex]} 
              className="lightbox-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              // Empêche la fermeture si on clique sur l'image elle-même
              onClick={(e) => e.stopPropagation()} 
              style={{
                  // L'image s'adapte à la taille du bloc Notion
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain', // Affiche toute l'image sans la couper
                  borderRadius: '0px', // Pas de bords arrondis en grand
                  boxShadow: 'none', // Pas d'ombre inutile
                  cursor: 'default'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
