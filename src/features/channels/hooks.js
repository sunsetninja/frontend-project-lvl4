import { useSelector, useDispatch } from 'react-redux';
import { useApi } from '../../services/api.jsx';
import { channelsSlice, getChannels } from './slice.js';

export const useChannels = () => {
  const { createChannel } = useApi();
  const { channels, activeChannelId } = useSelector(getChannels);

  return {
    channels,
    activeChannelId,
    createChannel,
  };
};

export const useChannel = (id) => {
  const api = useApi();
  const dispatch = useDispatch();
  const { activeChannelId } = useChannels();

  const isActive = activeChannelId === id;

  const channel = useSelector((state) => state.channels.channels.find((c) => c.id === id));
  const activateChannel = () => {
    dispatch(channelsSlice.actions.activateChannel(id));
  };

  return {
    channel,
    isActive,
    editChannel: ({ name }) => api.editChannel({ id: channel.id, name }),
    removeChannel: () => api.removeChannel({ id: channel.id }),
    activateChannel,
  };
};

export const getChannelMessages = (state, channelId) => {
  const { messages } = state.chat;
  return messages.filter((message) => message.channelId === channelId);
};

export const useChannelMessages = (channelId) => {
  const messages = useSelector((state) => getChannelMessages(state, channelId));
  return messages;
};
