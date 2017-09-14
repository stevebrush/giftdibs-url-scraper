const express = require('express');

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

const router = express.Router();
// router.use(authenticateJwt);
router.route('/scrape-product-url')
  .get(scrapeProductUrl);

module.exports = {
  middleware: {
    scrapeProductUrl
  },
  router
};
