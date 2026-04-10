import React, { useEffect, useState, useCallback } from 'react';
import FeedGrid from './components/FeedGrid';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    // Le timestamp empêche le navigateur de garder une ancienne version en cache
    fetch(`/api/notion?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="App">
      <div className="widget-header">
        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          {loading ? "..." : "↻ refresh"}
        </button>
      </div>

      {error ? (
        <div className="status-msg">Erreur : {error}</div>
      ) : posts.length === 0 && !loading ? (
        <div className="status-msg">Aucune image dans le calendrier.</div>
      ) : (
        <FeedGrid initialData={posts} onZoom={(url) => setSelectedImage(url)} />
      )}

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
