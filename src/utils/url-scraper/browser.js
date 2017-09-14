const createBrowser = () => {
  const Browser = require('zombie');
  const Fetch = require('zombie/lib/fetch');
  const { getActiveScraper } = require('./scraper');

  const browser = new Browser();

  browser.silent = true;
  browser.waitDuration = '30s';

  // Ignore certain resource requests.
  browser.pipeline.addHandler((browser, request) => {
    let doAbort = false;

    const ignoredResources = getActiveScraper().productConfig.ignoredResources;

    ignoredResources.forEach((domain) => {
      if (request.url.includes(domain)) {
        doAbort = true;
      }
    });

    if (doAbort) {
      return new Fetch.Response('', { status: 200 });
    }
  });

  return browser;
};

module.exports = {
  createBrowser
};
