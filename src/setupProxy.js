const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware(['/oauth2', '/bridge'], {
      target: 'https://api.meethue.com',
      changeOrigin: true,
    }),
  );
};
