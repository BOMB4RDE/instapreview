import React, { useEffect, useState, useCallback } from 'react';
import FeedGrid from './components/FeedGrid';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fonction pour charger les données
  const loadData = useCallback(() => {
    setLoading(true);
    fetch('/api/notion')
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data);
          setError(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Premier chargement au montage du composant
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && posts.length === 0) return <div className="status-msg">Chargement du feed...</div>;
  if (error) return <div className="status-msg">Erreur : {error} <button onClick={loadData}>Réessayer</button></div>;

  return (
    <div className="App">
      {/* HEADER AVEC BOUTON REFRESH */}
      <div className="widget-header">
        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          {loading ? "..." : "↻ Refresh"}
        </button>
      </div>

      <FeedGrid initialData={posts} onZoom={(url) => setSelectedImage(url)} />

      {/* LIGHTBOX (CONSERVÉE) */}
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
