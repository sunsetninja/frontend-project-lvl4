import { createSlice } from "@reduxjs/toolkit";
import { useApi } from "../api.js";
import { useDispatch } from "react-redux";

export const channelsSlice = createSlice({
  name: "channels",
  initialState: { channels: [] },
  reducers: {
    init: (draft, { payload }) => {
      draft.channels = payload.channels;
    },
    addChannel: (draft, { payload }) => {
      draft.channels.push(payload.channel);
    },
    removeChannel: (draft, { payload }) => {
      const index = draft.channels.findIndex(({ id }) => id === payload.id);
      if (index !== -1) draft.channels.splice(index, 1);
    },
  },
});

export const { init, addChannel, removeChannel } = channelsSlice.actions;

export const getChannels = ({ channels }) => channels;

export default channelsSlice.reducer;

export const useChannels = () => {
  const { socket } = useApi();
  const createChannel = async ({ name }) => {
    await socket.emitWithAcknowledge("newChannel", { name });
  };
  const removeChannel = async (id) => {
    await socket.emitWithAcknowledge("removeChannel", { id });
  };

  return { createChannel, removeChannel };
};

export const useListeners = (socket) => {
  const dispatch = useDispatch();

  socket.on("newChannel", (payload) => {
    dispatch(addChannel({ channel: payload }));
  });
  socket.on("removeChannel", (payload) => {
    dispatch(removeChannel({ id: payload.id }));
  });
};

export { default as Channels } from "./Channels.js";
