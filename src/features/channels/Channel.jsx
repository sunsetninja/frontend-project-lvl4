import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import React from 'react';
import { useChannel } from './index.js';
import { useChannelsModal } from './ChannelsModal.jsx';

const Channel = ({ channel }) => {
  const { t } = useTranslation();
  const { activateChannel, isActive } = useChannel(channel.id);
  const modal = useChannelsModal();

  const variant = isActive ? 'primary' : 'light';

  const ChannelButton = (
    <Button
      type="button"
      key={channel.id}
      className="text-left flex-grow-1 nav-link"
      onClick={activateChannel}
      variant={variant}
      style={{ width: '100%' }}
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
            <Dropdown.Item
              onClick={() => {
                modal.open({
                  type: 'channel_edit',
                  data: { channelId: channel.id },
                });
              }}
            >
              {t('channels.rename')}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                modal.open({
                  type: 'channel_remove',
                  data: { channelId: channel.id },
                });
              }}
            >
              {t('channels.remove')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        ChannelButton
      )}
    </li>
  );
};

export default Channel;
