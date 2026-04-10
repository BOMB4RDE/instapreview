import React, { useState } from 'react';
import PostItem from './components/PostItem';
// ... autres imports (grille, etc)

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="App">
      <div className="grid-container">
        {posts.map((post) => (
          <PostItem 
            key={post.id} 
            post={post} 
            onZoom={(url) => setSelectedImage(url)} 
          />
        ))}
      </div>

      {/* LA LIGHTBOX EST ICI, EN DEHORS DE LA GRILLE */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh', backgroundColor: 'black',
            zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div 
            style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '50px', cursor: 'pointer', zIndex: 1000000 }}
            onClick={() => setSelectedImage(null)}
          >×</div>
          <img 
            src={selectedImage} 
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
