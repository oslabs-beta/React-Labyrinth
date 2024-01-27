// !TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

// tests whether the parser still works when a component is given the wrong FilePath

const root = createRoot(document.getElementById('root'));
root.render(<App />);