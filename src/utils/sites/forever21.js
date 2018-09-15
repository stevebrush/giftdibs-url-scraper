const getConfig = (url) => {
  if (!/forever21\.com/.test(url)) {
    return;
  }

  return {
    nameSelector: '#h1Title',
    priceSelector: '#ItemPrice',
    imagesSelector: 'img.product_image',
    ignoredResources: [
      'bounceexchange.com',
      'www.res-x.com',
      'js-agent.newrelic.com',
      'vms.boldchat.com',
      'vmss.boldchat.com',
      'googletagmanager.com',
      'google-analytics.com',
      'cdns.brsrvr.com',
      'bam.nr-data.net'
    ]
  };
};

module.exports = {
  getConfig
};
