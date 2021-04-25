import React from "react";
import ChatMessageForm from "./ChatMessageForm.js";
import { useSelector } from "react-redux";
import { getChatMessages } from "./index.js";

const Chat = () => {
  const messages = useSelector(getChatMessages);

  return (
    <div className="d-flex flex-column h-100">
      <div id="messages-box" className="chat-messages overflow-auto mb-3">
        {messages.map(({ id, username, body }) => (
          <div className="text-break" key={id}>
            <b>{username}</b>
            {": "}
            {body}
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
