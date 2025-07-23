import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ConfigProvider locale={viVN}>
          <App />
      </ConfigProvider>
  </React.StrictMode>
);

