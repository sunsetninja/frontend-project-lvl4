import React from "react";
import initI18n from "./i18n.js";
import { I18nextProvider } from "react-i18next";
import App from "./App.js";

export default async () => {
  const i18n = await initI18n();

  return (
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
};
