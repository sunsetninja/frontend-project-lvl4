/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import remove from 'lodash/remove.js';
import { useApi } from '../../services/api.jsx';

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
      draft.activeChannelId = payload.channel.id;
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

export const { actions, reducer } = channelsSlice;

export const getChannels = ({ channels }) => channels;

export const useChannels = () => {
  const { createChannel } = useApi();
  const { channels, activeChannelId } = useSelector(getChannels);

  return {
    channels,
    activeChannelId,
    createChannel,
  };
};

export const useChannel = (id) => {
  const api = useApi();
  const dispatch = useDispatch();
  const { activeChannelId } = useChannels();

  const isActive = activeChannelId === id;

  const channel = useSelector((state) => state.channels.channels.find((c) => c.id === id));
  const activateChannel = () => {
    dispatch(channelsSlice.actions.activateChannel(id));
  };

  return {
    channel,
    isActive,
    editChannel: ({ name }) => api.editChannel({ id: channel.id, name }),
    removeChannel: () => api.removeChannel({ id: channel.id }),
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
