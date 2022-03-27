'use strict';

const { platform } = require('node:process');
const { join } = require('path');
const childProcess = require('child_process');
const { Widecrypt } = require('../packages/widecrypt');
const { logger } = require('./logger');
const { Files } = require('./files');
const { Http, HTTP_METHOD } = require('./network');

const DEVICES_PATH = join(process.cwd(), 'drm', 'devices');
const MP4DECRYPT_NAME = 'mp4decrypt' + (platform === 'win32' ? '.exe' : '');
const MP4DECRYPT_PATH = join(process.cwd(), 'bin', MP4DECRYPT_NAME);

const http = new Http();
const files = new Files();

const licenseRequestHandler = async (url, payload, headers, params) => {
  const options = {
    method: HTTP_METHOD.POST,
    body: params
      ? JSON.stringify({
          rawLicenseRequestBase64: Buffer.isBuffer(payload) ? payload.toString('base64') : payload,
          ...params,
        })
      : payload,
    headers,
    responseType: 'buffer',
  };
  const response = await http.request(url, options);
  const data = response.body;
  if (data[0] === /* '{' */ 0x7b) {
    const dataObject = JSON.parse(data.toString('utf8'));
    return dataObject.license || dataObject.payload || dataObject;
  }
  return data;
};

const getDecryptionKeys = async (psshBase64, drmConfig) => {
  const { server, certificate, headers, params } = drmConfig;

  let certificateBase64 = null;
  if (certificate) {
    const data = await licenseRequestHandler(certificate, 'CAQ=', headers, params);
    certificateBase64 = data.toString('base64');
  }

  const widecrypt = new Widecrypt({ logger });
  await widecrypt.initialize({ devicesPath: DEVICES_PATH });
  const sessionId = await widecrypt.createSession({
    initData: psshBase64,
    certData: certificateBase64,
  });
  const licenseRequest = await widecrypt.waitForLicenseRequest(sessionId);

  const data = await licenseRequestHandler(server, licenseRequest, headers, params);
  const licenseBase64 = data.toString('base64');

  await widecrypt.updateSession(sessionId, licenseBase64);
  const keys = await widecrypt.waitForKeys(sessionId);
  return keys;
};

const decryptFile = async (key, kid, input, output, cleanup) => {
  const isExecutableExists = files.exists(MP4DECRYPT_PATH);
  if (!isExecutableExists) {
    logger.error(`Decryption failed. Required package is missing: ${MP4DECRYPT_PATH}`);
    return;
  }
  const args = ['--key', `${kid}:${key}`, input, output];
  const mp4decrypt = childProcess.spawn(MP4DECRYPT_PATH, args);
  mp4decrypt.stdout.setEncoding('utf8');
  mp4decrypt.stdout.on('data', (data) => logger.debug(data));
  mp4decrypt.stderr.setEncoding('utf8');
  mp4decrypt.stderr.on('error', (data) => logger.error(data));
  await new Promise((resolve) =>
    mp4decrypt.on('close', () => {
      mp4decrypt.kill('SIGINT');
      resolve();
    })
  );
  if (cleanup) await files.delete(input, true);
};

module.exports = { getDecryptionKeys, decryptFile };
