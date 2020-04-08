const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const User = require('../models/User');

module.exports.checkout = async function checkout(ctx, next) {
  const user = ctx.user;
  const { product, phone, address } = ctx.request.body;
  let order = await Order.create({
    user,
    product,
    phone,
    address,
  });
  await sendMail({
    to: user.email,
    subject: 'order-confirmation',
    template: 'order-confirmation',
    locals: {
      id: order._id,
      product: product,
    },
  });
  ctx.status = 200;
  ctx.body = { order: order._id };
  next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { user } = ctx;
  let orders = await Order.find({ user: user.id });
  ctx.status = 200;
  ctx.body = { orders: orders };
  return next();
};
