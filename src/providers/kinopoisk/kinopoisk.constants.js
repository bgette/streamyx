'use strict';

const DOMAINS = {
  default: 'https://hd.kinopoisk.ru',
  passport: 'https://passport.yandex.ru',
  api: 'https://api.ott.kinopoisk.ru',
};

const API_ROUTES = {
  preAuth: `${DOMAINS.passport}/auth`,
  loginAuth: `${DOMAINS.passport}/registration-validations/auth/multi_step/start`,
  passwordAuth: `${DOMAINS.passport}/registration-validations/auth/multi_step/commit_password`,
  challengeSubmit: `${DOMAINS.passport}/registration-validations/auth/challenge/submit`,
  validatePhoneById: `${DOMAINS.passport}/registration-validations/auth/validate_phone_by_id`,
  phoneConfirmCodeSubmit: `${DOMAINS.passport}/registration-validations/phone-confirm-code-submit`,
  phoneConfirmCode: `${DOMAINS.passport}/registration-validations/phone-confirm-code`,
  challengeCommit: `${DOMAINS.passport}/registration-validations/auth/challenge/commit`,
};

module.exports = { DOMAINS, API_ROUTES };
