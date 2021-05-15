import React from "react";
import initI18n from "./i18n.js";
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Provider as AuthProvider } from "./features/auth.js";
import { Provider as ApiProvider } from "./features/api.js";
import App from "./App.js";
import createStore from "./store.js";
import * as yup from "yup";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback.js";
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

  console.log("here");

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
