import React, { useEffect, useState } from 'react';
import FeedGrid from './components/FeedGrid';
import { motion, AnimatePresence } from 'framer-motion'; // Ajout pour l'animation
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // État pour la Lightbox

  useEffect(() => {
    fetch('/api/notion')
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        if (data.error) { setError(data.error); } 
        else { setPosts(data); }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="status-msg">Chargement...</div>;
  if (error) return <div className="status-msg">Erreur : {error}</div>;

  return (
    <div className="App">
      {/* On passe la fonction de zoom à la grille */}
      <FeedGrid initialData={posts} onZoom={(url) => setSelectedImage(url)} />

      {/* LA LIGHTBOX EST MAINTENANT ICI (PLANS SUPÉRIEUR) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="close-lightbox" onClick={() => setSelectedImage(null)}>×</button>
            <motion.img 
              src={selectedImage} 
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
