import React, { createContext, useContext } from "react";
// eslint-disable-next-line import/no-cycle
import { useListeners as useChannelsListeners } from "./channels/index.js";
// eslint-disable-next-line import/no-cycle
import { useListeners as useChatListeners } from "./chat/index.js";

const APIContext = createContext({ socket: null });

const useApi = () => useContext(APIContext);

export { useApi };

const withAcknowledge =
  (fn) =>
  (...args) =>
    fn(...args, console.log);

export const Provider = ({ children, socket }) => {
  useChannelsListeners(socket);
  useChatListeners(socket);

  // eslint-disable-next-line no-param-reassign
  socket.emitWithAcknowledge = withAcknowledge((...args) => {
    socket.emit(...args);
  });

  return <APIContext.Provider value={{ socket }}>{children}</APIContext.Provider>;
};
