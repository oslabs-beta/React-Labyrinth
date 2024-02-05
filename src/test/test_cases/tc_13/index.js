// Test Case 13 - Recursive import of App1 and App2

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);