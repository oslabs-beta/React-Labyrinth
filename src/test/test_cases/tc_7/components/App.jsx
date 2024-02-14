import React, { Component } from 'react';
import ChildApp from './ChildApp';

export const App = () => {
//   this should not work when given to the parser
    return (
      <div>
        <p>Syntax Error</p>
        <ChildApp />
      </div>
    )
  
}