'use strict';

const { platform } = require('os');

const formatArgLabel = (rawLabel) => {
  const labelParts = rawLabel
    .replace(/--/g, '-')
    .split('-')
    .filter((i) => !!i);
  return labelParts
    .map((word, index) => (index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join('');
};

class Args {
  #argv;
  #data;
  parsed;

  constructor(argv = process.argv.slice(2)) {
    this.parsed = false;
    this.#argv = argv;
    this.#data = { arguments: [], options: [] };
  }

  setName(name) {
    this.#data.name = name;
    return this;
  }

  setDescription(description) {
    this.#data.description = description;
    return this;
  }

  setVersion(version) {
    this.#data.version = version;
    return this;
  }

  setArgument(name, description) {
    this.#data.arguments.push({ name, description });
    return this;
  }

  setOption(flags, description, defaultValue) {
    this.#data.options.push({ flags, description, defaultValue });
    return this;
  }

  parse(indexOfNamelessArg = -1) {
    if (!this.#argv.length) return this;
    const isNamelessArgAtBegin = this.#argv[0][0] !== '-';
    if (!isNamelessArgAtBegin) {
      this._ = [this.#argv.at(indexOfNamelessArg)];
      this.#argv.splice(indexOfNamelessArg, 1);
    }

    const parsedArgs = {};
    const argv = this.#argv;

    for (let i = 0; i < argv.length; i++) {
      const argument = argv[i];
      const previousArgument = argv[i - 1];
      const nextArgument = argv[i + 1];
      const isLabel = argv[i][0] === '-';

      if (isLabel) {
        const isLabelHasValue = nextArgument?.[0] !== undefined && nextArgument?.[0] !== '-';
        const label = formatArgLabel(argument);
        const value = isLabelHasValue ? nextArgument : true;
        parsedArgs[label] = value;
      } else {
        const isValueHasLabel = previousArgument?.[0] === '-';
        if (!isValueHasLabel)
          parsedArgs._ = Array.isArray(parsedArgs._) ? [...parsedArgs._, argument] : [argument];
      }
    }

    Object.keys(parsedArgs).forEach((key) => (this[key] = parsedArgs[key]));
    this.parsed = true;

    const hasArgs = parsedArgs ? Object.keys(parsedArgs).length > 0 : false;
    if (!hasArgs || 'h' in this || 'help' in this) this.outputHelp();
    if ('v' in this || 'version' in this) this.outputVersion();

    return this;
  }

  outputHelp() {
    this.outputDescription();
    this.outputVersion();
    this.outputUsage();
    this.outputArguments();
    this.outputOptions();
    process.exit(1);
  }

  outputDescription() {
    if (this.#data.description) console.log(`${this.#data.name}: ${this.#data.description}\n`);
  }

  outputUsage() {
    console.log(`\x1b[1mUSAGE\x1b[0m`);
    let message = `  $ ${this.#data.name} `;
    if (this.#data.options.length) message += `[OPTIONS] `;
    if (this.#data.arguments.length) message += this.#data.arguments.map((a) => a.name).join(' ');
    console.log(`${message}\n`);
  }

  outputArguments() {
    if (!this.#data.arguments.length) return;
    console.log(`\x1b[1mARGUMENTS\x1b[0m`);
    for (const argument of this.#data.arguments) {
      console.log(`  ${argument.name}  ${argument.description}\n`);
    }
  }

  outputOptions() {
    if (this.#data.options) {
      console.log(`\x1b[1mOPTIONS\x1b[0m`);
      this.#data.options.forEach((option) =>
        console.log(`  ${option.flags.padEnd(20)}  ${option.description}`)
      );
    }
  }

  outputVersion() {
    const { arch, version } = process;
    console.log(`\x1b[1mVERSION\x1b[0m`);
    console.log(`  ${this.#data.name}/${this.#data.version} ${platform}-${arch} node-${version}\n`);
  }
}

module.exports = { Args };
