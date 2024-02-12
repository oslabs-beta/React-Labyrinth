// Test Case 11 - Recursive import of App1 and App2

import React from 'react';
import { createRoot } from 'react-dom/client';
import App1 from './components/App1.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App1 />);