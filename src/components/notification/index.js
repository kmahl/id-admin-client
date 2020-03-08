import React from 'react';
import { notification } from 'antd';

/**
* Notification
* @param {String} type - success, error, info, warning; void="open"
*/
const Notification = (message, type = 'open', description) => {
  if (type === 'error') {
    message = message.replace("GraphQL error: ", "");
  }
  return notification[type]({
    message: message,
    description,
  });
};

export default Notification;