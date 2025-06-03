import React from 'react';
import './ThreeDStyles.css';

const ThreeDButton = ({ children, onClick, type = 'primary', size = 'medium', disabled = false }) => {
  const buttonClass = `threed-button threed-button-${type} threed-button-${size} ${disabled ? 'threed-button-disabled' : ''}`;
  
  return (
    <button 
      className={buttonClass}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ThreeDButton; 
