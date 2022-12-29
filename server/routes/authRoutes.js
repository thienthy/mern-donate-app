const express = require('express');
const router = express.Router();
const passport = require('passport');

// login user using the google strategy
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// redirect route for the passport google strategy
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(
      `https://mern-donateapp.onrender.com/login?login=success&id=${req.user._id}`
    );
  }
);

module.exports = router;
