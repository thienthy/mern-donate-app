const jwt = require('jsonwebtoken');

// generate a JWT token for the various applications represented by the 'option' argument
const generateToken = (id, option) => {
  if (option === 'access') {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // 7 days
    });
  } else if (option === 'forgot password') {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '300s', // 5 minutes
    });
  }
};

module.exports = generateToken;
