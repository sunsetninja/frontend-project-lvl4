import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth.js";

export default () => {
  const { t } = useTranslation();
  const usernameInputRef = useRef();
  const history = useHistory();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
      })}
      onSubmit={async (values) => {
        setAuthFailed(false);

        try {
          await auth.logIn(values);
          history.replace("/");
        } catch (error) {
          if (error?.response?.status === 401) {
            setAuthFailed(true);
            return;
          }
          throw error;
        }
      }}
    >
      {(props) => {
        return (
          <div className="container-fluid">
            <div className="row justify-content-center pt-5">
              <div className="col-sm-4">
                <Form onSubmit={props.handleSubmit} className="p-3">
                  <Form.Group>
                    <Form.Label htmlFor="username">
                      {t("login.username")}
                    </Form.Label>
                    <Form.Control
                      onChange={props.handleChange}
                      value={props.values.username}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={authFailed}
                      required
                      ref={usernameInputRef}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">
                      {t("login.password")}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      onChange={props.handleChange}
                      value={props.values.password}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("login.authFailed")}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    {t("login.submit")}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};
