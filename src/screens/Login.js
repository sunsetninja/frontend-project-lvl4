import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation();
  const usernameInputRef = useRef();

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
      onSubmit={console.log}
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
