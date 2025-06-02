import { keyframes } from 'styled-components';

// Bounce effect animation
export const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
`;

// Color change animation
export const colorChange = keyframes`
  0% { background-color: #4285F4; }
  25% { background-color: #EA4335; }
  50% { background-color: #FBBC05; }
  75% { background-color: #34A853; }
  100% { background-color: #4285F4; }
`;

// Fade animation
export const fade = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

// Rotation animation
export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 3D X-axis rotation animation
export const rotateX = keyframes`
  0% { transform: rotateX(0); }
  100% { transform: rotateX(360deg); }
`;

// 3D Y-axis rotation animation
export const rotateY = keyframes`
  0% { transform: rotateY(0); }
  100% { transform: rotateY(360deg); }
`;

// Complex 3D rotation animation
export const rotate3D = keyframes`
  0% { transform: rotate3d(1, 1, 1, 0deg); }
  100% { transform: rotate3d(1, 1, 1, 360deg); }
`;

// 3D pulse glow animation
export const pulseGlow3D = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale3d(1, 1, 1);
  }
  50% {
    box-shadow: 0 0 30px 10px rgba(66, 133, 244, 0.3),
                inset 0 0 15px rgba(255, 255, 255, 0.8);
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale3d(1, 1, 1);
  }
`;

// Wave animation
export const wave = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-10px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(10px); }
`;

// Ripple animation
export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

// Pulse glow animation
export const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(66, 133, 244, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
  }
`;

// Text reveal animation
export const textReveal = keyframes`
  0% { 
    clip-path: inset(0 100% 0 0);
    opacity: 0.3;
  }
  100% { 
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
`; 
