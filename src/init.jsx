import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import * as yup from "yup";
import { ErrorBoundary } from "react-error-boundary";
import initI18n from "./i18n.js";
import { Provider as AuthProvider } from "./features/auth.jsx";
import { Provider as ApiProvider } from "./features/api.jsx";
import App from "./App.jsx";
import createStore from "./store.js";
import ErrorFallback from "./components/ErrorFallback.jsx";
import { logger } from "./services/logger.js";

export default async (socket) => {
  const i18n = await initI18n();
  yup.setLocale({
    mixed: {
      required: i18n.t("validation.mixed.required"),
      uniq: i18n.t("validation.mixed.uniq"),
    },
    string: {
      string: {
        min: ({ min }) => i18n.t("validation.string.min", { min }),
        max: ({ max }) => i18n.t("validation.string.max", { max }),
      },
    },
  });
  const store = createStore();

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
