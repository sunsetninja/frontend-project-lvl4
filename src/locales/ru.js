/* eslint-disable no-template-curly-in-string */

export default {
  translation: {
    validation: {
      mixed: {
        required: 'Обязательное поле',
        uniq: 'Должно быть уникальным',
      },
      string: {
        min: 'Не менее ${min} символов',
        max: 'Не более ${max} символов',
      },
      password: {
        match: 'Пароли должны совпадать',
        min: 'Не менее 6 символов',
      },
      username: 'От 3 до 20 символов',
      channel: {
        uniq: 'Название канала должно быть уникальным',
      },
    },
    channels: {
      remove: 'Удалить',
      rename: 'Переименовать',
      channels: 'Каналы',
    },
    loading: 'Загрузка...',
    login: {
      username: 'Ваш ник',
      password: 'Пароль',
      submit: 'Войти',
      signup: 'Регистрация',
      newToChat: 'Нет аккаунта?',
      authFailed: 'Неверные имя пользователя или пароль',
    },
    modals: {
      add: 'Добавить канал',
      cancel: 'Отменить',
      submit: 'Отправить',
      remove: 'Удалить канал',
      confirmation: 'Уверены?',
      confirm: 'Удалить',
      rename: 'Переименовать канал',
    },
    hexletChat: 'Hexlet Chat',
    logout: 'Выйти',
    chat: {
      send: 'Отправить',
    },
    signup: {
      username: 'Имя пользователя',
      password: 'Пароль',
      passwordConfirm: 'Подтвердите пароль',
      alreadyExists: 'Такой пользователь уже существует',
      submit: 'Зарегистрироваться',
    },
  },
};
