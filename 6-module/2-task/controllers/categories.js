const Category = require('../models/Category');
const transform = require('../utils/index');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  ctx.body = { categories: transform(categories, 'categories') };
};
