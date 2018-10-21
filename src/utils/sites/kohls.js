const getConfig = (url) => {
  if (!/kohls\.com/.test(url)) {
    return;
  }

  return {
    nameSelector: 'h1.pdp-product-title',
    priceSelector: '#pdp-Pricing .main-price',
    imagesSelector: 'img.PDP_heroimage',
    ignoredResources: [
      'scontent.webcollage.net',
      'go-mpulse.net',
      'everesttech.net',
      'kohls.com/snb/media',
      'https://dpm.demdex.net',
      'hfjFonts.css',
      'apx.moatads.com',
      'adservice.google.com',
      'doubleclick.net',
      'favicon.ico',
      'pinterest.com',
      'cloudfront.net',
      'googletagservices.com'
    ]
  };
};

module.exports = {
  getConfig
};
