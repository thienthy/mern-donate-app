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
    console.log(req);
    res.redirect(
      `http://localhost:3000/login?login=success&id=${req.user._id}`
    );
  }
);

module.exports = router;
