let _activeScraper;

const cheerio = require('cheerio');

const cheerioConfig = {
  lowerCaseTags: false,
  lowerCaseAttributeNames: false,
  decodeEntities: false
};

function ProductScraper(browser) {
  const scraperConfigUtil = require('./config');

  this.url = undefined;
  this.productConfig = undefined;

  this.scrapeUrl = (url) => {
    this.productConfig = scraperConfigUtil.getConfig(url);
    this.url = url;

    return new Promise((resolve) => {
      browser.visit(url, {
        duration: '5s', // max wait time
        function: () => {
          // TODO: Is this really the best approach?
          // https://github.com/assaf/zombie/issues/1118
          const content = browser.html();
          const $ = cheerio.load(content, cheerioConfig);
          return ($(this.productConfig.readySelector).length > 0);
        }
      }, () => {
        const details = onBrowserLoaded();
        resolve(details);
      });
    });
  };

  this.getImages = (url) => {
    this.productConfig = scraperConfigUtil.getConfig(url);
    this.url = url;

    return new Promise((resolve) => {
      browser.visit(url, {
        duration: '30s'
      }, (err) => {
        if (err) { console.log('Error:' + err.message); }

        const content = browser.html();
        const $ = cheerio.load(content, cheerioConfig);
        const images = $('img');
        const values = [];

        Object.keys(images).forEach((key) => {
          const attr = images[key].attribs;
          if (attr) {
            values.push({
              src: attr.src
            });
          }
        });

        resolve(values);
      });
    });
  };

  const onBrowserLoaded = () => {
    const content = browser.html();
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

    let imageUrl = $(this.productConfig.thumbnailSelector).first().attr('src') || '';
    imageUrl = imageUrl.trim();

    // Do not allow base64 images
    // if (imageUrl.indexOf('data:image') === 0) {
    //   imageUrl = '';
    // }

    const productInfo = {
      name: name || 'No product name found',
      price,
      imageUrl,
      url: this.url
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
