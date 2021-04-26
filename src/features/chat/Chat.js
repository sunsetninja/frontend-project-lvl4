import React from "react";
import ChatMessageForm from "./ChatMessageForm.js";
import { useChannelMessages, useChannels } from "../channels/index.js";

const Chat = () => {
  const { activeChannelId } = useChannels();
  const messages = useChannelMessages(activeChannelId);

  return (
    <div className="d-flex flex-column h-100">
      <div id="messages-box" className="chat-messages overflow-auto mb-3">
        {messages.map(({ id, username, text }) => (
          <div className="text-break" key={id}>
            <b>{username}</b>
            {": "}
            {text}
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <ChatMessageForm />
      </div>
    </div>
  );
};

export default Chat;
