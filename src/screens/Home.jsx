import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../features/auth.jsx';
import { endpoints } from '../features/api.jsx';
import { actions as channelActions, Channels } from '../features/channels/index.js';
import { actions as chatActions, Chat } from '../features/chat/index.js';
import routes from '../routes.js';
import { useLogger } from '../services/logger.js';

function Home() {
  const history = useHistory();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const logger = useLogger();

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        const { data } = await auth.request(endpoints.dataPath());
        dispatch(channelActions.init({ channels: data.channels }));
        dispatch(chatActions.init({ messages: data.messages }));
        setLoading(false);
      } catch (error) {
        setLoading(false);

        if (error?.response?.status === 401) {
          history.replace(routes.login());
          return;
        }
        logger.error('Cannot fetch initial data', error);
        throw error;
      }
    };
    initApp();
  }, [history, dispatch, setLoading, auth, logger]);

  return loading ? (
    <Spinner animation="grow" role="status" variant="primary">
      <span className="sr-only">{t('loading')}</span>
    </Spinner>
  ) : (
    <div className="row flex-grow-1 h-75 pb-3">
      <div className="col-3 border-right">
        <Channels />
      </div>
      <div className="col h-100">
        <Chat />
      </div>
    </div>
  );
}

export default Home;
