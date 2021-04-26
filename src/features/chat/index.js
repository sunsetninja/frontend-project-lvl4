import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useApi } from "../api.js";
import { useChannels } from "../channels/index.js";
import { useAuth } from "../auth.js";

export const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [] },
  reducers: {
    init: (draft, { payload }) => {
      draft.messages = payload.messages;
    },
    addMessage: (draft, { payload }) => {
      draft.messages.push(payload.message);
    },
  },
});

export const { init } = chatSlice.actions;

export const getChat = ({ chat }) => chat;

export const getChatMessages = ({ chat }) => chat.messages;

export default chatSlice.reducer;

export const useChat = () => {
  const { socket } = useApi();
  const { user } = useAuth();
  const { activeChannelId } = useChannels();

  const createMessage = async ({ text }) => {
    await socket.emitWithAcknowledge("newMessage", {
      channelId: activeChannelId,
      text: text,
      username: user.username,
    });
  };

  return {
    createMessage,
  };
};

export const useListeners = (socket) => {
  const dispatch = useDispatch();

  const handleCreateMessage = (payload) => {
    dispatch(chatSlice.actions.addMessage({ message: payload }));
  };

  useEffect(() => {
    socket.on("newMessage", handleCreateMessage);

    return () => {
      socket.off("newMessage", handleCreateMessage);
    };
  }, [socket]);
};

export { default as Chat } from "./Chat.js";
