import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { message } from 'antd';

function NotificationListener({ employeeId, onNewNotification }) {
  useEffect(() => {
    if (!employeeId) return;


    const SOCKET_LOCAL = 'http://localhost:9123/notification';
    const SOCKET_PROD = 'https://ems-api.api-score.com/notification'; 
    

    const socket = io(SOCKET_PROD, {
      query: { employeeId },
      transports: ['websocket'],
    });

    socket.on('notification', (data) => {
      message.info(data.message);
      if (onNewNotification) {
        onNewNotification(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [employeeId, onNewNotification]);

  return null;
}

export default NotificationListener;