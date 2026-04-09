import React, { useEffect, useState } from 'react';
import FeedGrid from './components/FeedGrid';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On appelle notre fonction API Vercel
    fetch('/api/notion')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => console.error("Erreur Notion:", err));
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Chargement du feed...</div>;

  return (
    <div className="App">
      <FeedGrid initialData={posts} />
    </div>
  );
}

export default App;
