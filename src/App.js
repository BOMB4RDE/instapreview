import React from 'react';
import PostItem from './components/PostItem';
import './styles.css';

// Assure-toi que tes données 'posts' sont bien définies ou importées ici
// import { posts } from './data'; 

export default function App() {
  return (
    <div className="App">
      <div className="grid-container">
        {/* On vérifie que posts existe avant de faire le map */}
        {typeof posts !== 'undefined' && posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
