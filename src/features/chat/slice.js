/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove.js';
import { actions as channelActions } from '../channels/index.js';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    init: (state, { payload }) => {
      state.messages = payload.messages;
    },
    addMessage: (state, { payload }) => {
      state.messages.push(payload.message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelActions.removeChannel, (state, { payload }) => {
      remove(state.messages, (message) => message.channelId === payload.id);
    });
  },
});

export const { actions, reducer } = chatSlice;

export const getChat = ({ chat }) => chat;
