import React, { createContext, useContext } from "react";
import { useListeners as useChannelsListeners } from "./channels/index.js";

const APIContext = createContext({ socket: null });

const useApi = () => {
  return useContext(APIContext);
};

export { useApi };

const withAcknowledge = (fn) => (...args) => {
  return fn(...args, console.log);
};

export const Provider = ({ children, socket }) => {
  useChannelsListeners(socket);

  socket.emitWithAcknowledge = withAcknowledge((...args) => {
    socket.emit(...args);
  });

  return (
    <APIContext.Provider value={{ socket }}>{children}</APIContext.Provider>
  );
};
