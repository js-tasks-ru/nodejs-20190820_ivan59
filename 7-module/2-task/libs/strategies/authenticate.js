const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (typeof email === 'undefined' || email === null) {
    done(null, false, `Не указан email`);
    return;
  }
  const user = await User.findOne({email});
  if (user === null) {
    const newUser = {
      email,
      displayName,
    };
    const user = new User(newUser);
    user.save((err, user) => {
      if (err) {
        done(err, false);
      } else {
        done(null, user);
      }
    });
  } else {
    done(null, user);
  }
};
