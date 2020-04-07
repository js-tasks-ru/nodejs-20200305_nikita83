const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    const user = await User.findOne({ email });
    if (user === null) {
      done(null, false, 'Нет такого пользователя');
    } else if (await user.checkPassword(password)) {
      done(false, user);
    } else {
      done(null, false, 'Неверный пароль');
    }
  },
);
