import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { message } from 'antd';

function NotificationListener({ employeeId, onNewNotification }) {
  useEffect(() => {
    if (!employeeId) return;

    const socket = io('https://ems-api.api-score.com/notification', {
     // const socket = io('http://127.0.0.1:9123', {
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
