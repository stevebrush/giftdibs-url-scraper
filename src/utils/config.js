const scraperProductConfigs = require('giftdibs-product-page-scraper/src/product-config');

const urlParser = require('url');

const ignoredResources = require('./ignored-resources');

const defaultConfig = {
  nameSelector: 'title',
  priceSelector: null,
  imageSelector: 'img',
  ignoredResources: []
};

const defaultIgnored = [
  'adservice.google.com',
  'addthis.com',
  'advertising.com',
  'akamaihd.net',
  'bazaarvoice.com',
  'bing.com',
  'bluekai.com',
  'doubleclick.net',
  'facebook.com',
  'facebook.net',
  'go-mpulse.net',
  'googleadservices.com',
  'googletagmanager.com',
  'googletagservices.com',
  'google-analytics.com',
  'google.com/adsense',
  'optimizely.com',
  'pinterest.com',
  'twitter.com'
];

const getConfig = (url) => {
  const hostname = urlParser.parse(url).hostname.replace('www.', '').replace('www2.', '');
  const scraperConfig = scraperProductConfigs[hostname] || {};
  const ignoredResourcesConfig = ignoredResources[hostname] || [];

  const config = scraperConfig;
  config.ignoredResources = defaultIgnored.concat(ignoredResourcesConfig);

  return Object.assign({}, defaultConfig, config);
};

module.exports = {
  getConfig
};
