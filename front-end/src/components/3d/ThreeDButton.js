import React, { forwardRef } from 'react';
import './ThreeDStyles.css';

const ThreeDButton = forwardRef(({ children, onClick, type = 'primary', size = 'medium', disabled = false }, ref) => {
  const buttonClass = `threed-button threed-button-${type} threed-button-${size} ${disabled ? 'threed-button-disabled' : ''}`;
  
  return (
    <button 
      ref={ref}
      className={buttonClass}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});

ThreeDButton.displayName = 'ThreeDButton';

export default ThreeDButton; 
