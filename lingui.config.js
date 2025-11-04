/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'ko', 'cn', 'jp'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src/'],
    },
  ],
};
