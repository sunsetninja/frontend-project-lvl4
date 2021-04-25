import React from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getChannels, useChannels } from "./index.js";

const Channels = () => {
  const { t } = useTranslation();
  const { channels } = useSelector(getChannels);
  const { createChannel, removeChannel } = useChannels();

  return (
    <>
      <div className="d-flex mb-2">
        <span>{t("channels.channels")}</span>
        <Button
          type="button"
          variant="link"
          className="ml-auto p-0"
          onClick={async () => {
            await createChannel({ name: "test" });
          }}
        >
          +
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item">
            {channel.name}
            <Button
              size="sm"
              onClick={async () => {
                await removeChannel(channel.id);
              }}
            >
              X
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Channels;
