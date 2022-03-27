'use strict';

const DOMAINS = {
  website: 'https://www.wakanim.tv',
  api: 'https://account.wakanim.tv',
};

const API_ROUTES = {
  token: `${DOMAINS.api}/core/connect/token`,
  user: `${DOMAINS.api}/api/user`,
  catalogue: `${DOMAINS.api}/api/catalogue`,
  search: `${DOMAINS.api}/api/catalogue/search?searchtxt=`,
  show: `${DOMAINS.api}/api/catalogue/show?Id=`,
  episode: `${DOMAINS.api}/api/catalogue/episode?Id=`,
  episodeStreamingSVOD: `${DOMAINS.api}/api/catalogue/episodestreamingsvod?Id=`,
};

const CLIENTS = {
  windows: {
    id: 'wakanim.windows',
    secret: 'uV9MNdBIHSNhm3IC3xHV',
  },
  android: {
    id: 'wakanim.android.test2',
    secret: '9FJWYh6Dm5AcKc94VuM0',
  },
};

module.exports = { DOMAINS, API_ROUTES, CLIENTS };
