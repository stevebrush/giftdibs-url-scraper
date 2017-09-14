const { createBrowser } = require('./browser');
const { createScraper } = require('./scraper');

const getProductDetails = (urls, utilOptions = {}) => {
  const browser = createBrowser();

  return new Promise((resolve) => {
    let allProductDetails = [];
    let counter = 0;

    const init = (url) => {
      const scraper = createScraper(browser);

      scraper
        .scrapeUrl(url)
        .then((details) => {
          allProductDetails.push(details);

          if (urls[++counter]) {
            init(urls[counter]);
          } else {
            resolve(allProductDetails);
          }
        });
    };

    init(urls[counter]);
  });
};

module.exports = {
  getProductDetails
};
