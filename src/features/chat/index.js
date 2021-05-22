/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import remove from 'lodash/remove.js';
import { useApi } from '../api.jsx';
import { useChannels, actions as channelActions } from '../channels/index.js';
import { useAuth } from '../auth.jsx';

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

export const { actions } = chatSlice;

export const getChat = ({ chat }) => chat;

export default chatSlice.reducer;

export const useChat = () => {
  const { socket } = useApi();
  const { user } = useAuth();
  const { activeChannelId } = useChannels();

  const createMessage = async ({ text }) => {
    await socket.emitWithAcknowledge('newMessage', {
      channelId: activeChannelId,
      text,
      username: user.username,
    });
  };

  return { createMessage };
};

export const useListeners = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCreateMessage = (payload) => {
      dispatch(actions.addMessage({ message: payload }));
    };

    socket.on('newMessage', handleCreateMessage);

    return () => {
      socket.off('newMessage', handleCreateMessage);
    };
  }, [socket, dispatch]);
};

export { default as Chat } from './Chat.jsx';
