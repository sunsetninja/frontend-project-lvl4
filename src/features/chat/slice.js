/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove.js';
import { useApi } from '../../services/api.jsx';
import { useAuth } from '../../services/auth.jsx';
import { useChannels, actions as channelActions } from '../channels/index.js';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    init: (draft, { payload }) => {
      draft.messages = payload.messages;
    },
    addMessage: (draft, { payload }) => {
      draft.messages.push(payload.message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelActions.removeChannel, (draft, { payload }) => {
      remove(draft.messages, (message) => message.channelId === payload.id);
    });
  },
});

export const { actions, reducer } = chatSlice;

export const getChat = ({ chat }) => chat;

export const useChat = () => {
  const api = useApi();
  const { user } = useAuth();
  const { activeChannelId } = useChannels();

  return {
    createMessage: ({ text }) => api.createMessage({
      channelId: activeChannelId,
      text,
      username: user.username,
    }),
  };
};
