const express = require('express');
const puppeteer = require('puppeteer');

// const authenticateJwt = require('../middleware/authenticate-jwt');
const urlScraper = require('../utils/url-scraper');
const { URLScraperNotFoundError } = require('../shared/errors');

const scrapeProductUrl = [
  (req, res, next) => {
    const url = decodeURIComponent(req.query.url);
    const isUrl = (/^https?:\/\//.test(url));

    if (isUrl) {
      urlScraper
        .getProductDetails([ url ])
        .then((products) => res.json({ products }))
        .catch(next);
    } else {
      next(new URLScraperNotFoundError());
    }
  }
];

async function getImages(url) {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  // Ignore loading images.
  page.on('request', interceptedRequest => {
    if (interceptedRequest.resourceType() === 'image') {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  await page.goto(url);

  const data = await page.evaluate(() => {
    // TODO: Make this more specific for certain sites.
    const images = document.querySelectorAll('img');

    let result = [];
    images.forEach((image) => {
      const src = image.src;
      // TODO: Add specific URL matchers to ignore certain images.
      // (This one is for Amazon)
      if (src && src.indexOf('/sprites/') === -1) {
        result.push({ src });
      }
    });

    return result;
  });

  await browser.close();

  return data;
}

const router = express.Router();

router.route('/scrape-product-url')
  .get(scrapeProductUrl);

router.route('/images')
  .get((req, res, next) => {
    const url = decodeURIComponent(req.query.url);

    getImages(url)
      .then((images) => {
        res.json({ images });
      })
      .catch(next);
  });

module.exports = {
  middleware: {
    scrapeProductUrl
  },
  router
};
