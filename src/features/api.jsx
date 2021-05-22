/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */

import React, { createContext, useContext } from 'react';
import { useListeners as useChannelsListeners } from './channels/index.js';
import { useListeners as useChatListeners } from './chat/index.js';

const APIContext = createContext({ socket: null });

const useApi = () => useContext(APIContext);

export { useApi };

const withAcknowledgement = (socketFunc) => (...args) => new Promise((resolve, reject) => {
  // eslint-disable-next-line functional/no-let
  let state = 'pending';
  const timer = setTimeout(() => {
    state = 'rejected';
    reject();
  }, 3000);

  socketFunc(...args, (response) => {
    if (state !== 'pending') return;

    clearTimeout(timer);

    if (response.status === 'ok') {
      state = 'resolved';
      resolve(response.data);
    }

    reject();
  });
});

export const Provider = ({ children, socket }) => {
  useChannelsListeners(socket);
  useChatListeners(socket);

  socket.emitWithAcknowledge = withAcknowledgement((...args) => {
    socket.emit(...args);
  });

  return <APIContext.Provider value={{ socket }}>{children}</APIContext.Provider>;
};

const host = '';
const prefix = 'api/v1';

export const endpoints = {
  login: () => [host, prefix, 'login'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
  dataPath: () => [host, prefix, 'data'].join('/'),
};
