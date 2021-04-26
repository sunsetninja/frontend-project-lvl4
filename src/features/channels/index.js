import { createSlice } from "@reduxjs/toolkit";
import { useApi } from "../api.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import remove from "lodash-es/remove.js";

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
    editChannel: (draft, { payload }) => {
      const channel = draft.channels.find(
        ({ id }) => id === payload.channel.id
      );
      channel.name = payload.channel.name;
    },
    removeChannel: (draft, { payload }) => {
      remove(draft.channels, ({ id }) => id === payload.id);
      if (draft.activeChannelId === payload.id) {
        draft.activeChannelId = draft.channels[0]?.id ?? null;
      }
    },
    activateChannel: (draft, { payload }) => {
      draft.activeChannelId = payload;
    },
  },
});

const { addChannel, editChannel } = channelsSlice.actions;

export const { init, removeChannel } = channelsSlice.actions;

export const getChannels = ({ channels }) => channels;

export default channelsSlice.reducer;

export const useChannels = () => {
  const { socket } = useApi();
  const { channels, activeChannelId } = useSelector(getChannels);
  const createChannel = async ({ name }) => {
    await socket.emitWithAcknowledge("newChannel", { name });
  };

  return {
    channels,
    activeChannelId,
    createChannel,
  };
};

export const useChannel = (id) => {
  const { socket } = useApi();
  const dispatch = useDispatch();
  const { activeChannelId } = useChannels();

  const isActive = activeChannelId === id;

  const channel = useSelector((state) =>
    state.channels.channels.find((channel) => channel.id === id)
  );
  const editChannel = async ({ name }) => {
    await socket.emitWithAcknowledge("renameChannel", { id, name });
  };
  const removeChannel = async () => {
    await socket.emitWithAcknowledge("removeChannel", { id });
  };
  const activateChannel = () => {
    dispatch(channelsSlice.actions.activateChannel(id));
  };

  return { channel, isActive, editChannel, removeChannel, activateChannel };
};

export const getChannelMessages = (state, channelId) => {
  const messages = state.chat.messages;
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
  const handleEditChannel = (payload) => {
    console.log("renamed", payload);
    dispatch(editChannel({ channel: payload }));
  };
  const handleRemoveChannel = (payload) => {
    dispatch(removeChannel({ id: payload.id }));
  };

  useEffect(() => {
    socket.on("newChannel", handleCreateChannel);
    socket.on("renameChannel", handleEditChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
      socket.off("newChannel", handleCreateChannel);
      socket.off("renameChannel", handleEditChannel);
      socket.off("removeChannel", handleRemoveChannel);
    };
  }, [socket]);
};

export { default as Channels } from "./Channels.js";
