let _activeScraper;

function ProductScraper(browser, browserConfig = {}) {
  const cheerio = require('cheerio');
  const scraperConfigUtil = require('./config');

  this.url = undefined;
  this.productConfig = undefined;

  this.scrapeUrl = (url) => {
    this.productConfig = scraperConfigUtil.getConfig(url);
    this.url = url;

    return new Promise((resolve) => {
      browser.visit(url, () => {
        const details = onBrowserLoaded();
        resolve(details);
      });
    });
  };

  const onBrowserLoaded = () => {
    const content = browser.html();

    const cheerioConfig = {
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
      decodeEntities: false
    };

    const $ = cheerio.load(content, cheerioConfig);
    const name = $(this.productConfig.nameSelector).text().trim();

    let price = $(this.productConfig.priceSelector)
      .text()
      .trim()
      .replace('$', '')
      .replace(/ /g, '');

    price = parseFloat(price);
    price = Math.round(price);

    if (isNaN(price)) {
      price = 0;
    }

    let thumbnailSrc = $(this.productConfig.thumbnailSelector).first().attr('src') || '';
    thumbnailSrc = thumbnailSrc.trim();

    const productInfo = {
      name: name || 'No product name found',
      price,
      thumbnailSrc,
      url: this.url,
      dateScraped: new Date()
    };

    return productInfo;
  };
}

const createScraper = (browser) => {
  _activeScraper = new ProductScraper(browser);
  return _activeScraper;
};

const getActiveScraper = () => {
  return _activeScraper;
};

module.exports = {
  createScraper,
  getActiveScraper
};
