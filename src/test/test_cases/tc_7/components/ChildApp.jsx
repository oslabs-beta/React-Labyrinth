// this component will not show up in the children of App due to App's syntax error
import React, { Component } from 'react';

export const ChildApp = () => {
    return (
      <div>
        <p>Child of App with Syntax Error</p>
      </div>
    )
  
}