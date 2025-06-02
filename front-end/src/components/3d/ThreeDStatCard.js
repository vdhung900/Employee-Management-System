import React, { useState } from 'react';
import { Card, Statistic } from 'antd';
import './ThreeDStyles.css';

const ThreeDStatCard = ({ 
  title, 
  value, 
  icon, 
  color = '#52c41a', 
  suffix, 
  prefix,
  style = {}, 
  className = '', 
  valueStyle = {},
  hoverable = true,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      className={`three-d-stats ${className}`}
      style={{
        ...style,
        transition: 'all 0.3s ease',
        boxShadow: isHovered && hoverable 
          ? '0 10px 20px rgba(0, 0, 0, 0.08)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transform: isHovered && hoverable ? 'translateY(-3px)' : 'none',
        borderTop: `3px solid ${color}`,
      }}
      bordered={false}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Statistic
          title={
            <span style={{ 
              fontSize: '14px', 
              color: 'rgba(0, 0, 0, 0.65)'
            }}>
              {title}
            </span>
          }
          value={value}
          valueStyle={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: color,
            ...valueStyle 
          }}
          suffix={suffix}
          prefix={prefix}
        />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: `rgba(${color === '#52c41a' ? '82, 196, 26' : 
                           color === '#1890ff' ? '24, 144, 255' : 
                           color === '#faad14' ? '250, 173, 20' : '255, 77, 79'}, 0.1)`,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}>
          <span style={{ fontSize: '22px', color: color }}>
            {icon}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ThreeDStatCard; 
