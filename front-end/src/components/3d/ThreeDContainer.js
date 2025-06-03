import React from 'react';
import './ThreeDStyles.css';

const ThreeDContainer = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`threed-container ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ThreeDContainer; 
