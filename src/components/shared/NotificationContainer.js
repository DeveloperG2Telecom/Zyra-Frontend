import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import Notification from './Notification';
import './NotificationContainer.css';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return React.createElement('div', {
    className: 'notification-container'
  },
    notifications.map(notification => 
      React.createElement('div', {
        key: notification.id,
        className: 'notification-item'
      },
        React.createElement(Notification, {
          message: notification.message,
          type: notification.type,
          duration: notification.duration,
          onClose: () => removeNotification(notification.id)
        })
      )
    )
  );
};

export default NotificationContainer;
