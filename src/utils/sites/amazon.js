const getConfig = (url) => {
  if (!/amazon\.com/.test(url)) {
    return;
  }

  return {
    nameSelector: '#productTitle',
    priceSelector: [
      '#buybox .offer-price',
      '#newPrice .buyingPrice',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#price_inside_buybox'
    ].join(', '),
    imagesSelector: '#landingImage',
    ignoredResources: [
      'https://completion.amazon.com',
      '.amazon-adsystem.com',
      'https://www.amazon.com/gp/customer-reviews',
      'https://fls-na.amazon.com',
      'https://www.amazon.com/gp/redirection/',
      'https://www.amazon.com/gp/sponsored-products'
    ]
  };
};

module.exports = {
  getConfig
};
