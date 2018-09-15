const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
  images: [{
    url: String
  }],
  name: String,
  price: Number,
  url: String,
  createdAt: {
    type: Date,
    expires: 86400,
    default: Date.now
  }
}, {
  collection: 'product'
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product
};
