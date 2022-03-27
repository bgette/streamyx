'use strict';

const { logger } = require('../../logger');
const { API_ROUTES, DOMAINS } = require('./crunchyroll.constants');

class CrunchyrollApi {
  #http;
  #auth;

  constructor(http, auth) {
    this.#http = http;
    this.#auth = auth;
  }

  async getProfile() {
    return this._getData(API_ROUTES.betaProfile);
  }

  async getObject(id) {
    const cmsToken = this.#auth.cmsToken;
    const url = `${API_ROUTES.betaCms}${cmsToken.cms.bucket}/objects/${id}`;
    const params = new URLSearchParams({
      Policy: cmsToken.cms.policy,
      Signature: cmsToken.cms.signature,
      'Key-Pair-Id': cmsToken.cms.key_pair_id,
    }).toString();
    return this._getData(`${url}?${params}`);
  }

  async _getData(route, json = true) {
    logger.debug(`Getting data from ${route}...`);
    let data = '';
    const url = this._isFullUrl(route) ? route : DOMAINS.betaApi + route;
    const response = await this.#http.request(url, { http2: false });
    data = response?.body || '';

    const isSuccess = response.statusCode === 200;
    if (isSuccess) {
      try {
        return json ? JSON.parse(data) : data;
      } catch (e) {
        logger.error(`Parsing JSON response failed. Route: ${route}`);
        process.exit(1);
      }
    }

    response.statusCode === 401 && logger.error(`Unauthorized: ${route}`);
    response.statusCode === 400 && logger.error(`Bad Request: ${route}`);
    logger.debug(`Request failed. Route: ${route}. ${data}`);
    process.exit(1);
  }

  _isFullUrl(value) {
    try {
      return !!new URL(value);
    } catch (e) {
      return false;
    }
  }
}

module.exports = { CrunchyrollApi };
