module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email === undefined) return done(null, false, 'Не указан email');
  try {
    const user = await User.findOne({ email });
    if (user === null) {
      await User.create({ email: email, displayName: displayName });
      const persen = await User.findOne({ email });
      done(false, persen);
    } else if (typeof user === 'object') return done(false, user);   
  } catch (err) {
    done(err);
  }
};
