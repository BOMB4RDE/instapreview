import React from 'react';
import FeedGrid from './components/FeedGrid';
import './styles.css';

// Exemple de données (Simulant ta Database Notion)
const mockData = [
  { id: '1', url: 'https://picsum.photos/500/500?random=1' },
  { id: '2', url: ['https://picsum.photos/500/500?random=2', 'https://picsum.photos/500/500?random=3'], type: 'carousel' },
  { id: '3', url: 'https://picsum.photos/500/500?random=4' },
  { id: '4', url: 'https://picsum.photos/500/500?random=5' },
];

function App() {
  return (
    <div className="App">
      <FeedGrid initialData={mockData} />
    </div>
  );
}

export default App;
