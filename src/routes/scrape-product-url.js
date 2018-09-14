const express = require('express');

// const authenticateJwt = require('../middleware/authenticate-jwt');
const urlScraper = require('../utils/url-scraper');
const { URLScraperNotFoundError } = require('../shared/errors');
const { Product } = require('../database/models/product');

function scrapeProductUrl(req, res, next) {
  const url = decodeURIComponent(req.query.url);
  const isUrl = (/^https?:\/\//.test(url));

  if (!isUrl) {
    next(new URLScraperNotFoundError());
    return;
  }

  Product.find({ url })
    .limit(1)
    .select('imageUrl name price url')
    .lean()
    .then((products) => {
      const product = products[0];

      if (!product) {
        return urlScraper.getProductDetails([ url ])
          .then((details) => {
            const doc = new Product(details[0]);
            return doc.save();
          });
      }

      return product;
    })
    .then((doc) => {
      res.json({
        product: {
          imageUrl: doc.imageUrl,
          name: doc.name,
          price: doc.price,
          url: doc.url
        }
      });
    })
    .catch(next);

  // const url = decodeURIComponent(req.query.url);
  // const isUrl = (/^https?:\/\//.test(url));

  // if (isUrl) {
  //   urlScraper.getProductDetails([ url ])
  //     .then((products) => res.json({
  //       product: products[0]
  //     }))
  //     .catch(next);
  // } else {
  //   next(new URLScraperNotFoundError());
  // }
}

function scrapeProductUrls(req, res, next) {
  const urls = JSON.parse(req.body.urls);

  const foundBadUrl = urls.find((url) => {
    return !(/^https?:\/\//.test(url));
  });

  if (foundBadUrl) {
    next(new URLScraperNotFoundError());
    return;
  }

  let result = [];
  let urlsRemaining = urls;

  Product
    .find({
      url: { $in: urls }
    })
    .select('imageUrl name price url')
    .lean()
    .then((products) => {
      products.forEach((product) => {
        const index = urlsRemaining.indexOf(product.url);
        if (index > -1) {
          urlsRemaining.splice(index, 1);
        }
      });

      result = products;

      if (urlsRemaining.length > 0) {
        return urlScraper.getProductDetails(urlsRemaining)
          .then((details) => {
            const promises = details.map((detail) => {
              const doc = new Product(detail);
              result.push({
                url: doc.url,
                name: doc.name,
                price: doc.price,
                imageUrl: doc.imageUrl
              });
              return doc.save();
            });

            return Promise.all(promises)
              .then(() => result);
          });
      }

      return result;
    })
    .then((products) => {
      res.json({
        products
      });
    })
    .catch(next);

  // urlScraper.getProductDetails(urls)
  //   .then((products) => {
  //     const promises = products.map((product) => {
  //       const doc = new Product(product);
  //       return doc.save();
  //     });

  //     return Promise.all(promises)
  //       .then(() => products);
  //   })
  //   .then((products) => {
  //     res.json({
  //       products
  //     });
  //   })
  //   .catch(next);
}

function scrapeImages(req, res, next) {
  const url = decodeURIComponent(req.query.url);
  const isUrl = (/^https?:\/\//.test(url));

  console.log('url?', url);

  if (!isUrl) {
    next(new URLScraperNotFoundError());
    return;
  }

  urlScraper.getImages(url)
    .then((images) => {
      res.json({
        images
      });
    })
    .catch(next);
}

const router = express.Router();

router.route('/products')
  .get(scrapeProductUrl)
  .post(scrapeProductUrls);

router.route('/images')
  .get(scrapeImages);

module.exports = {
  middleware: {
    scrapeProductUrl
  },
  router
};
