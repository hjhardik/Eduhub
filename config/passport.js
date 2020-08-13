//using passport authentication
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
  //use passort local strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user with the help of email address
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match hashed password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  //serializing the user
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  //deserializing the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
