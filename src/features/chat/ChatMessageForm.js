import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ChatMessageForm = () => {
  const { t } = useTranslation();

  return (
    <Form>
      <InputGroup>
        <Form.Control name="body" aria-label="body" />
        <InputGroup.Append>
          <Button variant="primary" type="submit">
            {t("chat.send")}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default ChatMessageForm;
