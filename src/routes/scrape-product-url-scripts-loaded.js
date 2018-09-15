// const express = require('express');
// const puppeteer = require('puppeteer');
// const { Product } = require('../database/models/product');
// const { URLScraperNotFoundError } = require('../shared/errors');
// const scrapeUrlDomCallback = require('./scrape-product-dom-callback');

// const router = express.Router();
// const isUrlRegExp = /^https?:\/\//;

// async function getProductDetails(url, config) {
//   // https://github.com/GoogleChrome/puppeteer/issues/1718
//   const browser = await puppeteer.launch({
//     headless: true,
//     dumpio: false,
//     ignoreHTTPSErrors: true,
//     args: [
//       '--no-sandbox',
//       "--proxy-server='direct://'",
//       '--proxy-bypass-list=*',
//       '--disable-setuid-sandbox',
//       '--ignore-certificate-errors'
//     ]
//   });

//   const page = await browser.newPage();

//   // TODO: If we enable this code block, the load times are much quicker,
//   // however, the image dimensions are unknown and all images are sent back to client.

//   // await page.setRequestInterception(true);

//   // page.on('request', (request) => {
//   //   let doAbort = false;

//   //   // Ignore loading images.
//   //   if (request.resourceType() === 'image') {
//   //     doAbort = true;
//   //   } else if (config.ignoredResources) {
//   //     const found = config.ignoredResources.find((resource) => {
//   //       return (request.url().indexOf(resource) > -1);
//   //     });

//   //     if (found) {
//   //       console.log('IGNORE:', found);
//   //       doAbort = true;
//   //     }
//   //   }

//   //   if (doAbort) {
//   //     request.abort();
//   //   } else {
//   //     request.continue();
//   //   }
//   // });

//   // await page.setRequestInterception(true);

//   // page.on('request', (request) => {
//   //   // console.log('LOADING:', request.url());

//   //   let doAbort = false;

//   //   // Ignore loading images.
//   //   if (config.ignoredResources) {
//   //     const found = config.ignoredResources.find((resource) => {
//   //       return (request.url().indexOf(resource) > -1);
//   //     });

//   //     if (found) {
//   //       // console.log('IGNORE:', found);
//   //       doAbort = true;
//   //     } else {
//   //       console.log('KEEP:', request.url());
//   //     }
//   //   }

//   //   if (doAbort) {
//   //     request.abort();
//   //   } else {
//   //     request.continue();
//   //   }
//   // });

//   // Uncomment for debugging.
//   page.on('console', msg => console.log('PAGE LOG:', msg.text()));

//   await page.goto(url);

//   const result = await page.evaluate(scrapeUrlDomCallback, config);
//   result.url = url;

//   await browser.close();

//   return result;
// }

// async function scrapeProductUrl(url, config) {
//   const products = await Product.find({ url })
//     .limit(1)
//     .select('images price url')
//     .lean();

//   let product = products[0];

//   if (!product) {
//     const details = await getProductDetails(url, config);
//     const doc = new Product(details);
//     product = await doc.save();
//   }

//   return {
//     images: product.images,
//     price: product.price,
//     url
//   };
// }

// router.route('/products')
//   .get((req, res, next) => {
//     const url = decodeURIComponent(req.query.url);
//     const isUrl = isUrlRegExp.test(url);

//     if (!isUrl) {
//       next(new URLScraperNotFoundError());
//       return;
//     }

//     const scraperConfigUtil = require('../utils/config');
//     const config = scraperConfigUtil.getConfig(url);

//     scrapeProductUrl(url, config)
//       .then((product) => {
//         res.json({ product });
//       })
//       .catch(next);
//   });

// module.exports = {
//   router
// };
