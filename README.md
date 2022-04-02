# Streamyx

Cross-platform application that allows you to download content from streaming services.

## Quick start

- Put **ffmpeg** and **mp4decrypt** executables into `./bin`
- Put **device private keys** into `./drm/devices`

Open system console/terminal from the folder where the executable file is located and run the application:

```
./streamyx [options] <URL>
```

Use `-h` option to see all available options.

## Build

- Install dependencies: `npm i`
- Build executables: `npm run build`

You can start script then:

```
node streamyx
```

## Requirements

- [Node.js](https://nodejs.org) v16 or later
- **Widecrypt** closed-source library (located in `./packages`)
