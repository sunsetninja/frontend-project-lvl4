/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import remove from 'lodash/remove.js';
import { useApi } from '../api.jsx';

export const channelsSlice = createSlice({
  name: 'channels',
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
      const { id } = payload.channel;
      const channel = draft.channels.find((c) => c.id === id);
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

export const { actions } = channelsSlice;

export const getChannels = ({ channels }) => channels;

export default channelsSlice.reducer;

export const useChannels = () => {
  const { socket } = useApi();
  const { channels, activeChannelId } = useSelector(getChannels);
  const createChannel = async ({ name }) => {
    await socket.emitWithAcknowledge('newChannel', { name });
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

  const channel = useSelector((state) => state.channels.channels.find((c) => c.id === id));
  const editChannel = async ({ name }) => {
    await socket.emitWithAcknowledge('renameChannel', { id, name });
  };
  const removeChannel = async () => {
    await socket.emitWithAcknowledge('removeChannel', { id });
  };
  const activateChannel = () => {
    dispatch(channelsSlice.actions.activateChannel(id));
  };

  return {
    channel,
    isActive,
    editChannel,
    removeChannel,
    activateChannel,
  };
};

export const getChannelMessages = (state, channelId) => {
  const { messages } = state.chat;
  return messages.filter((message) => message.channelId === channelId);
};

export const useChannelMessages = (channelId) => {
  const messages = useSelector((state) => getChannelMessages(state, channelId));
  return messages;
};

export const useListeners = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { addChannel, editChannel, removeChannel } = actions;

    const handleCreateChannel = (payload) => {
      dispatch(addChannel({ channel: payload }));
    };
    const handleEditChannel = (payload) => {
      dispatch(editChannel({ channel: payload }));
    };
    const handleRemoveChannel = (payload) => {
      dispatch(removeChannel({ id: payload.id }));
    };

    socket.on('newChannel', handleCreateChannel);
    socket.on('renameChannel', handleEditChannel);
    socket.on('removeChannel', handleRemoveChannel);

    return () => {
      socket.off('newChannel', handleCreateChannel);
      socket.off('renameChannel', handleEditChannel);
      socket.off('removeChannel', handleRemoveChannel);
    };
  }, [socket, dispatch]);
};

export { default as Channels } from './Channels.jsx';
