import React, { useEffect, useState } from 'react';
import FeedGrid from './components/FeedGrid';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/notion')
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        // Si data est une erreur envoyée par l'API
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="status-msg">Chargement du feed...</div>;
  if (error) return <div className="status-msg">Erreur : {error}</div>;
  if (posts.length === 0) return <div className="status-msg">Aucune image trouvée dans Media.</div>;

  return (
    <div className="App">
      <FeedGrid initialData={posts} />
    </div>
  );
}

export default App;
