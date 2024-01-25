// what we are building to test for 
// we will point to index.js and call new instance of parser passing in file

// expecting: 
// if the value of new instance is an obj
// tree is undefined with a proper file

// test case 0 - simple react app with one app component

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);