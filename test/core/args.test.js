const { Args } = require('../../src/args');

test('args', () => {
  const link = 'https://www.wakanim.tv/ru/v2/catalogue/episode/34641/';
  const args = new Args([link, '-q', '720p']).parse();
  expect(args).toMatchObject({ _: [link], q: '720p' });
  const args2 = new Args(['-q', '720p', '-d', link]).parse();
  expect(args2).toMatchObject({ _: [link], q: '720p', d: true });
});
