import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useChat } from './hooks.js';
import { useChannels } from '../channels/index.js';
import { useLogger } from '../../services/logger.js';

function ChatMessageForm() {
  const { t } = useTranslation();
  const { createMessage } = useChat();
  const { activeChannelId } = useChannels();
  const textInputRef = useRef(null);
  const logger = useLogger();

  useEffect(() => {
    textInputRef.current.focus();
  }, [activeChannelId]);

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async ({ text }, formikHelpers) => {
        try {
          await createMessage({ text });
          formikHelpers.resetForm();
          textInputRef.current.focus();
        } catch (error) {
          logger.warn('Cannot send message', error);
        }
        formikHelpers.setSubmitting(false);
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
