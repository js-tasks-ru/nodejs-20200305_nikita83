const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');
const User = require('./models/User');
function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const token = socket.handshake.query.token;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const userInfo = await Session.findOne({ token }).populate('user');

    if (!userInfo) {
      return next(new Error('wrong or expired session token'));
    }
    socket.user = userInfo.user;
    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async (msg) => {
      const { displayName, id } = socket.user;
      await Message.create({
        date: new Date(),
        text: msg,
        user: displayName,
        chat: id,
      });
      await Message.save();
    });
  });

  return io;
}

module.exports = socket;
