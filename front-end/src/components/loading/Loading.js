import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './Loading.css';

const Loading = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="loading-overlay">
      <Spin 
        indicator={antIcon}
        tip="Loading..."
        size="large"
      />
    </div>
  );
};

export default Loading;
