import React, { useState } from 'react';
import { Card } from 'antd';
import './ThreeDStyles.css';

const ThreeDCard = ({ 
  children, 
  title, 
  extra, 
  style = {}, 
  className = '', 
  loading = false, 
  hoverable = true,
  bordered = false,
  headStyle = {},
  bodyStyle = {},
  cover = null,
  actions = [],
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      className={`three-d-card ${className}`}
      style={{
        ...style,
        transition: 'all 0.3s ease',
        transform: hoverable && isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: hoverable && isHovered 
          ? '0 10px 20px rgba(0, 0, 0, 0.08)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
      title={title}
      extra={extra}
      loading={loading}
      hoverable={false}
      cover={cover}
      actions={actions}
      styles={{
        header: {
          borderBottom: '1px solid rgba(82, 196, 26, 0.1)',
          ...headStyle
        },
        body: {
          padding: '16px',
          ...bodyStyle
        }
      }}
      variant={bordered ? 'outlined' : 'plain'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </Card>
  );
};

export default ThreeDCard; 
