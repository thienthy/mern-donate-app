const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

// setup for the google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          User.create({
            name: profile.displayName,
            password: 123456,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            status: 'Active',
          }).then((newUser) => {
            done(null, newUser);
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
