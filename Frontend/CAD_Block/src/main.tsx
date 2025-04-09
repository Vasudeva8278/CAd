// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

// Import your components
import Upload from './Component/Upload';
import BlockList from './Component/BlockList';

const App = () => {
  return (
    <div>
      <h1>Welcome to Your Blank Vite + TypeScript App</h1>
      <p>Start building something awesome!</p>

      <h2>Upload DXF File</h2>
      <Upload />

      <h2>Block List</h2>
      <BlockList />
    </div>
  );
};

ReactDOM.createRoot(document.querySelector('#app')!).render(<App />);
