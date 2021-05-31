import React, { createContext, useContext } from 'react';

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
  const api = {
    createChannel: withAcknowledgement((...args) => socket.emit('newChannel', ...args)),
    editChannel: withAcknowledgement((...args) => socket.emit('renameChannel', ...args)),
    removeChannel: withAcknowledgement((...args) => socket.emit('removeChannel', ...args)),
    createMessage: withAcknowledgement((...args) => socket.emit('newMessage', ...args)),
  };

  return <APIContext.Provider value={api}>{children}</APIContext.Provider>;
};

const host = '';
const prefix = 'api/v1';

export const endpoints = {
  login: () => [host, prefix, 'login'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
  dataPath: () => [host, prefix, 'data'].join('/'),
};
