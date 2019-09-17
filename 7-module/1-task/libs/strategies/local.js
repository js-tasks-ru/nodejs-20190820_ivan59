const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');


module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await User.findOne({email: email});
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }
      const check = await user.checkPassword(password);
      if (check) {
        return done(null, user);
      }
      // это капец товарищи преподаватели ))
      done(null, false, 'Невереный пароль');
    }
);
