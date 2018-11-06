const express = require('express');
const puppeteer = require('puppeteer');
const scrapeProductPage = require('giftdibs-product-page-scraper/src/scrape-product-page');

const env = require('../shared/environment');
const { URLScraperNotFoundError } = require('../shared/errors');

const router = express.Router();
const isUrlRegExp = /^https?:\/\//;

async function launchUrl(url, callback, args) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--hide-scrollbars',
      '--ignore-certificate-errors',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote'
    ]
  });

  const page = await browser.newPage();

  // See: https://intoli.com/blog/making-chrome-headless-undetectable/
  // Use Safari, so that some sites won't serve webp images (like Target.com).
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15'
  );

  if (env.get('NODE_ENV') === 'development') {
    page.on('console', (message) => {
      console.log('PAGE LOG:', message.text());
    });
  }

  await page.setRequestInterception(true);
  await page.setBypassCSP(true);

  page.on('request', (request) => {
    const requestUrl = request.url();
    let doAbort = false;

    // Ignore loading images.
    if (args.ignoredResources) {
      const found = args.ignoredResources.find((resource) => {
        return (requestUrl.indexOf(resource) > -1);
      });

      if (found) {
        doAbort = true;
      }
    }

    if (doAbort) {
      // if (env.get('NODE_ENV') === 'development') {
      //   console.log('IGNORE RESOURCE:', requestUrl);
      // }

      request.abort();
    } else {
      if (env.get('NODE_ENV') === 'development') {
        console.log('ALLOW:', requestUrl);
      }

      request.continue();
    }
  });

  await page.goto(url);

  const result = await page.evaluate(callback, args);

  await browser.close();

  return result;
}

async function scrapeProductUrl(url, config) {
  const details = await launchUrl(url, scrapeProductPage, config);

  details.url = url;

  return details;
}

router.route('/products').get((req, res, next) => {
  const url = decodeURIComponent(req.query.url);
  const isUrl = isUrlRegExp.test(url);

  if (!isUrl) {
    next(new URLScraperNotFoundError());
    return;
  }

  const { getConfig } = require('../utils/config');
  const productConfig = getConfig(url);

  scrapeProductUrl(url, productConfig)
    .then((product) => {
      res.json({ product });
    })
    .catch(next);
});

module.exports = {
  router
};
