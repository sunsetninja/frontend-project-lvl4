import { configureStore } from '@reduxjs/toolkit';
import { reducer as channels } from './features/channels/index.js';
import { reducer as chat } from './features/chat/index.js';

export default () => {
  const reducer = { channels, chat };

  return configureStore({ reducer });
};
