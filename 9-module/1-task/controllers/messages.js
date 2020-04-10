const Message = require('../models/Message');
const mapperMessage = require('../mappers/message')

module.exports.messageList = async function messages(ctx, next) {
  const message = await Message.find({chat: ctx.user.id}).limit(20)
  ctx.body = {messages: message.map(mapperMessage)}
};
