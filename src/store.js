import { configureStore } from '@reduxjs/toolkit';
import channels from './features/channels/index.js';
import chat from './features/chat/index.js';

export default () => {
  const reducer = { channels, chat };

  return configureStore({ reducer });
};
