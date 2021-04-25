import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [] },
  reducers: {
    init: (draft, { payload }) => {
      draft.messages = payload.messages;
    },
  },
});

export const { init } = chatSlice.actions;

export const getChat = ({ chat }) => chat;

export const getChatMessages = ({ chat }) => chat.messages;

export default chatSlice.reducer;

export { default as Chat } from "./Chat.js";
