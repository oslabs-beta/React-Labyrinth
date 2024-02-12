// Test Case 0 - Simple react app with one app component

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './component/App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);