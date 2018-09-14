const createBrowser = () => {
  const Browser = require('zombie');
  const Fetch = require('zombie/lib/fetch');
  const { getActiveScraper } = require('./scraper');

  const browser = new Browser({
    runScripts: true,
    silent: true,
    waitDuration: '30s'
  });

  // Ignore certain resource requests.
  browser.pipeline.addHandler((browser, request) => {
    let doAbort = false;

    const productConfig = getActiveScraper().productConfig;

    if (!productConfig) {
      return Promise.resolve();
    }

    const ignoredResources = productConfig.ignoredResources;

    ignoredResources.forEach((domain) => {
      if (request.url.includes(domain)) {
        doAbort = true;
      }
    });

    if (doAbort) {
      console.log('IGNORE:', request.url);
      return new Fetch.Response('', { status: 200 });
    } else {
      console.log('ALLOW:', request.url);
    }

    return Promise.resolve();
  });

  return browser;
};

module.exports = {
  createBrowser
};
