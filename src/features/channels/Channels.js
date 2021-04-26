import React from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useChannels } from "./index.js";

const Channel = ({ channel }) => {
  const { t } = useTranslation();
  const { removeChannel, activeChannelId, activateChannel } = useChannels();

  const variant = channel.id === activeChannelId ? "primary" : "light";

  const ChannelButton = (
    <Button
      type="button"
      key={channel.id}
      className="text-left flex-grow-1 nav-link"
      onClick={() => activateChannel(channel.id)}
      variant={variant}
      style={{ width: "100%" }}
    >
      {channel.name}
    </Button>
  );

  return (
    <li key={channel.id} className="nav-item" style={{ marginBottom: 8 }}>
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="d-flex mb-2">
          {ChannelButton}
          <Dropdown.Toggle split className="flex-grow-0" variant={variant} />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => removeChannel(channel.id)}>
              {t("channels.remove")}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        ChannelButton
      )}
    </li>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const { channels, createChannel } = useChannels();

  return (
    <>
      <div className="d-flex mb-2">
        <span>{t("channels.channels")}</span>
        <Button
          type="button"
          variant="link"
          className="ml-auto p-0"
          onClick={() => createChannel({ name: "test" })}
        >
          +
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </ul>
    </>
  );
};

export default Channels;
