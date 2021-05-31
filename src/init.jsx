import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as yup from 'yup';
import { ErrorBoundary } from 'react-error-boundary';
import initI18n from './i18n.js';
import { actions as chatActions } from './features/chat';
import { actions as channelsActions } from './features/channels';
import { Provider as AuthProvider } from './services/auth.jsx';
import { Provider as ApiProvider } from './services/api.jsx';
import { logger } from './services/logger.js';
import App from './App.jsx';
import createStore from './store.js';
import ErrorFallback from './components/ErrorFallback.jsx';

export default async (socket) => {
  const i18n = await initI18n();
  yup.setLocale({
    mixed: {
      required: i18n.t('validation.mixed.required'),
      uniq: i18n.t('validation.mixed.uniq'),
    },
    string: {
      min: ({ min }) => i18n.t('validation.string.min', { min }),
      max: ({ max }) => i18n.t('validation.string.max', { max }),
    },
  });
  const store = createStore();

  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel({ channel: payload }));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.editChannel({ channel: payload }));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsActions.removeChannel({ id: payload.id }));
  });
  socket.on('newMessage', (payload) => {
    store.dispatch(chatActions.addMessage({ message: payload }));
  });

  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ApiProvider socket={socket}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={(error) => {
                logger.error(error);
              }}
              onReset={() => window.location.reload()}
            >
              <App />
            </ErrorBoundary>
          </ApiProvider>
        </AuthProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
};
