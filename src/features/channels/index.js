import { createSlice } from "@reduxjs/toolkit";
import { useApi } from "../api.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getChatMessages } from "../chat/index.js";

export const channelsSlice = createSlice({
  name: "channels",
  initialState: { channels: [], activeChannelId: null },
  reducers: {
    init: (draft, { payload }) => {
      draft.channels = payload.channels;
      draft.activeChannelId = payload.channels[0]?.id ?? null;
    },
    addChannel: (draft, { payload }) => {
      draft.channels.push(payload.channel);
    },
    removeChannel: (draft, { payload }) => {
      const index = draft.channels.findIndex(({ id }) => id === payload.id);
      if (index !== -1) draft.channels.splice(index, 1);
    },
    activateChannel: (draft, { payload }) => {
      draft.activeChannelId = payload;
    },
  },
});

const { addChannel, removeChannel } = channelsSlice.actions;

export const { init } = channelsSlice.actions;

export const getChannels = ({ channels }) => channels;

export const getActiveChannelId = (state) => {
  const channels = getChannels(state);
  return channels.activeChannelId;
};

export default channelsSlice.reducer;

export const useChannels = () => {
  const { socket } = useApi();
  const { channels, activeChannelId } = useSelector(getChannels);
  const dispatch = useDispatch();
  const createChannel = async ({ name }) => {
    await socket.emitWithAcknowledge("newChannel", { name });
  };
  const removeChannel = async (id) => {
    await socket.emitWithAcknowledge("removeChannel", { id });
  };
  const activateChannel = (id) => {
    dispatch(channelsSlice.actions.activateChannel(id));
  };

  return {
    channels,
    createChannel,
    removeChannel,
    activeChannelId,
    activateChannel,
  };
};

export const getChannelMessages = (state, channelId) => {
  const messages = getChatMessages(state);
  return messages.filter((message) => message.channelId === channelId);
};

export const useChannelMessages = (channelId) => {
  const messages = useSelector((state) => getChannelMessages(state, channelId));
  return messages;
};

export const useListeners = (socket) => {
  const dispatch = useDispatch();

  const handleCreateChannel = (payload) => {
    dispatch(addChannel({ channel: payload }));
  };
  const handleRemoveChannel = (payload) => {
    dispatch(removeChannel({ id: payload.id }));
  };

  useEffect(() => {
    socket.on("newChannel", handleCreateChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
      socket.off("newChannel", handleCreateChannel);
      socket.off("removeChannel", handleRemoveChannel);
    };
  }, [socket]);
};

export { default as Channels } from "./Channels.js";
