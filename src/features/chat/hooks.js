import { useApi } from '../../services/api.jsx';
import { useAuth } from '../../services/auth.jsx';
import { useChannels } from '../channels/index.js';

// eslint-disable-next-line import/prefer-default-export
export const useChat = () => {
  const api = useApi();
  const { user } = useAuth();
  const { activeChannelId } = useChannels();

  return {
    createMessage: ({ text }) => api.createMessage({
      channelId: activeChannelId,
      text,
      username: user.username,
    }),
  };
};
