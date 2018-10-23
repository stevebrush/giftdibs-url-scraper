const scraperProductConfigs = require('giftdibs-product-page-scraper/src/config');
const urlParser = require('url');

const ignoredResources = require('./ignored-resources');

const defaultConfig = {
  nameSelector: 'title',
  priceSelector: null,
  imagesSelector: 'img',
  ignoredResources: []
};

const getConfig = (url) => {
  const hostname = urlParser.parse(url).hostname.replace('www.', '');
  const scraperConfig = scraperProductConfigs[hostname] || {};
  const ignoredResourcesConfig = ignoredResources[hostname] || [];

  const config = scraperConfig;
  config.ignoredResources = ignoredResourcesConfig;

  return Object.assign({}, defaultConfig, config);
};

module.exports = {
  getConfig
};
