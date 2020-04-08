const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  try {
    const { email, displayName, password } = ctx.request.body;
    const user = new User({
      displayName: displayName,
      email: email,
      verificationToken: token,
    });
    await new Promise((res, rej) => {
      res(user.setPassword(password));
    })
      .then(() => user.save())
      .then(() =>
        sendMail({
          template: 'confirmation',
          subject: 'Подтвердите почту',
          to: user.email,
          locals: { token: user.verificationToken },
        }),
      )
      .then(() => {
        ctx.status = 200;
        ctx.body = { status: 'ok' };
      });
  } catch (err) {
    if (err.errors.email) {
      ctx.status = 400;
      ctx.body = { errors: { email: err.errors.email.message } };
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  if (!verificationToken) {
    ctx.throw(400, 'Invalid token');
  }
  const user = await User.findOne({ verificationToken: verificationToken });
  if (!user) {
    ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    return;
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.status = 200;
  ctx.body = { token };
};
