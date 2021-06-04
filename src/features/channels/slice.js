/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove.js';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [], activeChannelId: null },
  reducers: {
    init: (state, { payload }) => {
      state.channels = payload.channels;
      state.activeChannelId = payload.channels[0]?.id ?? null;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload.channel);
      state.activeChannelId = payload.channel.id;
    },
    editChannel: (state, { payload }) => {
      const { id } = payload.channel;
      const channel = state.channels.find((c) => c.id === id);
      channel.name = payload.channel.name;
    },
    removeChannel: (state, { payload }) => {
      remove(state.channels, ({ id }) => id === payload.id);
      if (state.activeChannelId === payload.id) {
        state.activeChannelId = state.channels[0]?.id ?? null;
      }
    },
    activateChannel: (state, { payload }) => {
      state.activeChannelId = payload;
    },
  },
});

export const { actions, reducer } = channelsSlice;

export const getChannels = ({ channels }) => channels;
