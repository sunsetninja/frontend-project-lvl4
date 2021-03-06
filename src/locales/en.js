/* eslint-disable no-template-curly-in-string */

export default {
  translation: {
    validation: {
      mixed: {
        required: 'Required',
        uniq: 'Must be unique',
      },
      string: {
        min: 'Min {{min}} characters',
        max: 'Max {{max}} characters',
      },
      password: {
        match: 'Passwords must match',
        min: 'Min 6 characters',
      },
      username: '3 to 20 characters',
      channel: {
        uniq: 'Channel name must be unique',
      },
    },
    channels: {
      remove: 'Remove',
      rename: 'Rename',
      channels: 'Channels',
    },
    loading: 'Loading...',
    login: {
      username: 'Username',
      password: 'Password',
      submit: 'Submit',
      signup: 'Sign up',
      newToChat: 'New to chat?',
      authFailed: 'username or password is incorrect',
    },
    modals: {
      add: 'Add channel',
      cancel: 'Cancel',
      submit: 'Submit',
      remove: 'Remove channel',
      confirmation: 'Are you sure?',
      confirm: 'Confirm',
      rename: 'Rename channel',
    },
    hexletChat: 'Hexlet Chat',
    logout: 'Log out',
    chat: {
      send: 'Send',
    },
    signup: {
      username: 'Username',
      password: 'Password',
      passwordConfirm: 'Confirm password',
      alreadyExists: 'Username already taken',
      submit: 'Submit',
    },
  },
};
