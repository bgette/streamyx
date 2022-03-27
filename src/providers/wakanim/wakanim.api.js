'use strict';

const { logger } = require('../../logger');
const { API_ROUTES, DOMAINS } = require('./wakanim.constants');

class WakanimApi {
  #http;

  constructor(http) {
    this.#http = http;
  }

  async getUser() {
    return this.#getData(API_ROUTES.user);
  }

  async getEpisode(id) {
    return this.#getData(API_ROUTES.episode + id);
  }

  async getEpisodeStreamingInfo(id) {
    return this.#getData(API_ROUTES.episodeStreamingSVOD + id);
  }

  async getShow(id) {
    return this.#getData(API_ROUTES.show + id);
  }

  async getSearch(query) {
    return this.#getData(API_ROUTES.search + query.toLowerCase());
  }

  async getCatalogue() {
    return this.#getData(API_ROUTES.catalogue);
  }

  async #getData(route, json = true) {
    logger.debug(`Getting data from ${route}...`);
    let data = '';
    const url = this.#isFullUrl(route) ? route : DOMAINS.api + route;
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

  #isFullUrl(value) {
    try {
      return !!new URL(value);
    } catch (e) {
      return false;
    }
  }
}

module.exports = { WakanimApi };
