import React, { useEffect, useState, useMemo } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import property from 'lodash/property.js';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useChannel, useChannels } from './index.js';
import { useLogger } from '../../services/logger.js';

const ChannelsModalContext = React.createContext({
  info: { type: null, data: null },
  open: () => {},
  close: () => {},
});

export const useChannelsModal = () => React.useContext(ChannelsModalContext);

export const Provider = ({ children }) => {
  const [info, setInfo] = useState(null);

  const value = useMemo(
    () => ({ info, open: setInfo, close: () => setInfo(null) }),
    [info, setInfo],
  );

  return <ChannelsModalContext.Provider value={value}>{children}</ChannelsModalContext.Provider>;
};

const ChannelRemoveForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const modal = useChannelsModal();
  const { removeChannel } = useChannel(modal.info?.data?.channelId);
  const logger = useLogger();

  const handleRemove = async () => {
    setLoading(true);

    try {
      await removeChannel();
      setLoading(false);
      modal.close();
    } catch (error) {
      logger.error('Cannot remove channel', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('modals.confirmation')}
        <div className="d-flex justify-content-between">
          <Button
            className="mr-2"
            variant="secondary"
            type="button"
            onClick={modal.close}
            disabled={loading}
          >
            {t('modals.cancel')}
          </Button>
          <Button variant="danger" type="button" onClick={handleRemove} disabled={loading}>
            {t('modals.confirm')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const getValidationSchema = (channels) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required()
      .min(3)
      .max(20)
      .notOneOf(channels, 'validation.channel.uniq'),
  });

  return schema;
};

const ChannelCreateForm = () => {
  const inputRef = React.useRef(null);
  const { t } = useTranslation();
  const { channels, createChannel } = useChannels();
  const modal = useChannelsModal();
  const logger = useLogger();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={getValidationSchema(channels.map(property('name')))}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={async ({ name }, { setSubmitting }) => {
            try {
              await createChannel({ name });
              modal.close();
            } catch (error) {
              logger.error('Cannot create channel', error);
              setSubmitting(false);

              inputRef.current.select();
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <Form.Group>
                <Form.Control
                  className="mb-2"
                  disabled={props.isSubmitting}
                  ref={inputRef}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.name}
                  isInvalid={props.errors.name && props.touched.name}
                  name="name"
                  aria-label="add channel"
                  data-testid="add-channel"
                />
                <Form.Control.Feedback type="invalid">{t(props.errors.name)}</Form.Control.Feedback>
                <div className="d-flex justify-content-end">
                  <Button className="mr-2" variant="secondary" type="button" onClick={modal.close}>
                    {t('modals.cancel')}
                  </Button>
                  <Button variant="primary" type="submit" disabled={props.isSubmitting}>
                    {t('modals.submit')}
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
};

const ChannelEditForm = () => {
  const inputRef = React.useRef(null);
  const { t } = useTranslation();
  const { channels } = useChannels();
  const modal = useChannelsModal();
  const { channel, editChannel } = useChannel(modal.info?.data?.channelId);
  const logger = useLogger();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: channel.name }}
          validationSchema={getValidationSchema(channels.map(property('name')))}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={async ({ name }, { setSubmitting }) => {
            try {
              await editChannel({ name });
              modal.close();
            } catch (error) {
              logger.error('Cannot edit channel', error);
              setSubmitting(false);

              inputRef.current.select();
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <Form.Group>
                <Form.Control
                  className="mb-2"
                  disabled={props.isSubmitting}
                  ref={inputRef}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.name}
                  isInvalid={props.errors.name && props.touched.name}
                  name="name"
                  aria-label="edit channel"
                  data-testid="edit-channel"
                />
                <Form.Control.Feedback type="invalid">{t(props.errors.name)}</Form.Control.Feedback>
                <div className="d-flex justify-content-end">
                  <Button className="mr-2" variant="secondary" type="button" onClick={modal.close}>
                    {t('modals.cancel')}
                  </Button>
                  <Button variant="primary" type="submit" disabled={props.isSubmitting}>
                    {t('modals.submit')}
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
};

const mapping = {
  channel_remove: ChannelRemoveForm,
  channel_create: ChannelCreateForm,
  channel_edit: ChannelEditForm,
};

const ChannelsModal = () => {
  const { info } = useChannelsModal();
  const Component = mapping[info?.type];

  return <Modal show={Boolean(info?.type)}>{Component && <Component />}</Modal>;
};

export default ChannelsModal;
