const DOMAINS = {
  default: 'https://www.crunchyroll.com',
  defaultApi: 'https://api.crunchyroll.com',
  beta: 'https://beta.crunchyroll.com',
  betaApi: 'https://beta-api.crunchyroll.com',
};

const API_ROUTES = {
  rss: `${DOMAINS.default}/rss/anime`,
  rss_cid: `${DOMAINS.default}/syndication/feed?type=episodes&id=`, // &lang=enUS
  rss_gid: `${DOMAINS.default}/syndication/feed?type=episodes&group_id=`, // &lang=enUS
  search1: `${DOMAINS.default}/ajax/?req=RpcApiSearch_GetSearchCandidates`,
  search2: `${DOMAINS.default}/search_page`,
  media: `${DOMAINS.default}/media-`,
  series: `${DOMAINS.default}/series-`,
  auth: `${DOMAINS.default}/login`,

  // mobile api
  search3: `${DOMAINS.defaultApi}/autocomplete.0.json`,
  session: `${DOMAINS.defaultApi}/start_session.0.json`,
  collections: `${DOMAINS.defaultApi}/list_collections.0.json`,

  // beta api
  betaAuthBasic: 'Basic bm9haWhkZXZtXzZpeWcwYThsMHE6',
  betaAuthBasicMob:
    'Basic YTZ5eGxvYW04c2VqaThsZDhldnc6aFQ3d2FjWHhNaURJcDhSNE9kekJybWVoQUtLTEVKUEE=',
  betaAuth: `${DOMAINS.betaApi}/auth/v1/token`,
  betaProfile: `${DOMAINS.betaApi}/accounts/v1/me/profile`,
  betaCmsToken: `${DOMAINS.betaApi}/index/v2`,
  betaSearch: `${DOMAINS.betaApi}/content/v1/search`,
  betaBrowse: `${DOMAINS.betaApi}/content/v1/browse`,
  betaCms: `${DOMAINS.betaApi}/cms/v2`,
};

const AUTH_TOKENS = {
  authBasic: 'Basic bm9haWhkZXZtXzZpeWcwYThsMHE6',
  authBasicMob: 'Basic YTZ5eGxvYW04c2VqaThsZDhldnc6aFQ3d2FjWHhNaURJcDhSNE9kekJybWVoQUtLTEVKUEE=',
};

module.exports = { DOMAINS, API_ROUTES, AUTH_TOKENS };
