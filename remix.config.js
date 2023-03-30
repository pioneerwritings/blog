/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  serverBuildPath: 'api/index.js',
  serverDependenciesToBundle: ['esbuild'],

  future: {
    unstable_tailwind: true,
    v2_errorBoundary: true,
    v2_meta: true
  }
}
