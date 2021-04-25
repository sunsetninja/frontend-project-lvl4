import React, { useEffect } from "react";
import initI18n from "./i18n.js";
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Provider as AuthProvider } from "./features/auth.js";
import { Provider as ApiProvider } from "./features/api.js";
import App from "./App.js";
import createStore from "./store.js";

export default async (socket) => {
  const i18n = await initI18n();
  const store = createStore();

  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ApiProvider socket={socket}>
            <App />
          </ApiProvider>
        </AuthProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
};
