import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import routes from "../routes.js";
import { useAuth } from "../features/auth.js";
import { useDispatch } from "react-redux";
import { init as initChannels, Channels } from "../features/channels/index.js";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { init as initChat, Chat } from "../features/chat/index.js";

export default () => {
  const history = useHistory();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(async () => {
    try {
      setIsLoading(true);
      const { data } = await auth.request(routes.dataPath());
      dispatch(initChannels({ channels: data.channels }));
      dispatch(initChat({ messages: data.messages }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.status === 401) {
        history.replace("/login");
        return;
      }
      throw error;
    }
  }, [history, dispatch, setIsLoading, auth]);

  return isLoading ? (
    <Spinner animation="grow" role="status" variant="primary">
      <span className="sr-only">{t("loading")}</span>
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
};
