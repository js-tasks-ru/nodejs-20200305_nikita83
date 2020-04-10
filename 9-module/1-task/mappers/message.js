module.exports = function mapperMessage(message) {
  return {
    date: message.date,
    text: message.text,
    id: message.id,
    user: message.user,
  };
};
