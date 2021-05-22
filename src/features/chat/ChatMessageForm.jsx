import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useChat } from './index.js';
import { useChannels } from '../channels/index.js';

function ChatMessageForm() {
  const { t } = useTranslation();
  const { createMessage } = useChat();
  const { activeChannelId } = useChannels();
  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, [activeChannelId]);

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async ({ text }, formikHelpers) => {
        await createMessage({ text });
        formikHelpers.resetForm();
        textInputRef.current.focus();
      }}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <InputGroup>
            <Form.Control
              name="text"
              aria-label="text"
              value={props.values.text}
              onChange={props.handleChange}
              ref={textInputRef}
              data-testid="new-message"
            />
            <InputGroup.Append>
              <Button variant="primary" type="submit">
                {t('chat.send')}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      )}
    </Formik>
  );
}

export default ChatMessageForm;
