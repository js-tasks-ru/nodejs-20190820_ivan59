const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  if (ctx.query && ctx.query.subcategory) {
    if (mongoose.Types.ObjectId.isValid(ctx.query.subcategory)) {
      const products = await Product.find({ subcategory: ctx.query.subcategory })
      ctx.status = 200;
      ctx.body = { products };
    } else {
      ctx.status = 404;
      ctx.body = { products: [] };
    }
  } else {
    return next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  console.log('2');
  const products = await Product.find({});
  ctx.statusCode = 200;
  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.status = 404;
    return;
  }

  ctx.status = 200;
  ctx.body = { product };
};

