import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { useChannels } from './slice.js';
import Channel from './Channel.jsx';
import ChannelsModal, {
  Provider as ChannelsModalProvider,
  useChannelsModal,
} from './ChannelsModal.jsx';

const ChannelsHeader = () => {
  const { t } = useTranslation();
  const modal = useChannelsModal();

  return (
    <div className="d-flex mb-2">
      <span>{t('channels.channels')}</span>
      <Button
        type="button"
        variant="link"
        className="ml-auto p-0"
        onClick={() => modal.open({ type: 'channel_create' })}
      >
        +
      </Button>
    </div>
  );
};

const Channels = () => {
  const { channels } = useChannels();

  return (
    <ChannelsModalProvider>
      <ChannelsHeader />
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </ul>
      <ChannelsModal />
    </ChannelsModalProvider>
  );
};

export default Channels;
