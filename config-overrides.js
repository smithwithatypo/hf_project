const webpack = require('webpack');

module.exports = function override(config) {
  // Fallback for Node.js core modules
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    path: require.resolve('path-browserify'),
  };
  return config;
};