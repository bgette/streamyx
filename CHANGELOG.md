# Changelog

## [Unreleased][unreleased]

## [3.0.2][] - 2022-04-02

- Skip decryption if content keys not found
- Send provisioning request for all providers
- Update dependencies
- Use request and response filters in decryption module to modify data
- Add movie detection for Crunchyroll (to have a separate filename)

## [3.0.1][] - 2022-03-28

First generation of downloader with following features

- Support providers: Crunchyroll, Wakanim, Kinopoisk
- Trim video with --trim-begin and --trim-end arguments
- Support quality, episode & season selection, also multiple audio & subtitle language selection
- Built-in decryption and muxing modules with third party dependencies (mp4decrypt, ffmpeg)
- Support filename template
- Support skipping muxing, downloading video, audio or subtitles

[unreleased]: https://github.com/vitnore/streamyx/compare/v3.0.2...HEAD
[3.0.2]: https://github.com/vitnore/streamyx/releases/tag/v3.0.2
[3.0.1]: https://github.com/vitnore/streamyx/releases/tag/v3.0.1
