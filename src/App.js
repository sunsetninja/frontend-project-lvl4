import React from "react";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation();

  return <h1>{t("channels.remove")}</h1>;
};
