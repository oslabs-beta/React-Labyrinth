//! TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);