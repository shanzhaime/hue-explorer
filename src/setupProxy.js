const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy(['/oauth2', '/bridge'], {
      target: 'https://api.meethue.com',
      changeOrigin: true,
    }),
  );
};
