'use strict';

const { join, dirname } = require('path');
const { existsSync, mkdirSync, createWriteStream } = require('fs');
const fsp = require('fs/promises');

class Files {
  #stream = null;
  workDir = process.cwd();

  setWorkDir(workDir) {
    this.workDir = workDir;
    this.createPath(workDir);
  }

  goTo(folderName) {
    const fullPath = join(this.workDir, folderName);
    this.createPath(fullPath);
    this.workDir = fullPath;
  }

  createPath(path) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }

  async write(filename, data) {
    const path = this.#getFullPath(filename);
    const convertedData = this.#convertData(data);
    try {
      await fsp.writeFile(path, convertedData);
    } catch (e) {
      throw Error(`Failed to save data to file: ${path}`);
    }
  }

  async append(filename, data) {
    const path = this.#getFullPath(filename);
    const convertedData = this.#convertData(data);
    try {
      await fsp.appendFile(path, convertedData);
    } catch (e) {
      throw Error(`Failed to append data to file: ${path}`);
    }
  }

  async read(filename, json = false, encoding = 'utf8') {
    const path = this.#getFullPath(filename);
    try {
      const data = await fsp.readFile(path, { encoding });
      return json ? JSON.parse(data) : data;
    } catch (e) {
      throw Error(`Failed to load file: ${path}`);
    }
  }

  async delete(filename, absolutePath = false) {
    const path = absolutePath ? filename : this.#getFullPath(filename);
    if (!existsSync(path)) return;
    try {
      await fsp.unlink(path);
    } catch (e) {
      throw Error(`Failed to delete file: ${path}`);
    }
  }

  #getFullPath(filename) {
    const fullPath = join(this.workDir, filename);
    this.createPath(dirname(fullPath));
    return fullPath;
  }

  #convertData(data) {
    if (Buffer.isBuffer(data) || ArrayBuffer.isView(data)) return data;
    if (typeof data === 'object') return JSON.stringify(data, null, 2);
    return data;
  }

  createStream(path) {
    this.#stream = createWriteStream(path);
  }

  async writeStream(data) {
    return new Promise((resolve, reject) =>
      this.#stream.write(data, (err) => (err ? reject(err) : resolve()))
    );
  }

  async closeStream() {
    await new Promise((resolve) =>
      this.#stream.end(() => {
        this.#stream.close();
        this.#stream.destroy();
        setTimeout(() => resolve(), 50);
      })
    );
  }

  exists(path) {
    return existsSync(path);
  }
}

module.exports = { Files };
