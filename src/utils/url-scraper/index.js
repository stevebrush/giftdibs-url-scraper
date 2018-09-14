const { createBrowser } = require('./browser');
const { createScraper } = require('./scraper');

const getProductDetails = (urls) => {
  const browser = createBrowser();

  return new Promise((resolve) => {
    let allProductDetails = [];
    let counter = 0;

    const init = (url) => {
      const scraper = createScraper(browser);

      scraper.scrapeUrl(url)
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

function getImages(url) {
  const browser = createBrowser();
  const scraper = createScraper(browser);

  return scraper.getImages(url);
}

module.exports = {
  getImages,
  getProductDetails
};
