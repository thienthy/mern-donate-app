const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./connectDB/db');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportSetup = require('./passport/passportSetup');

const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const donationRoutes = require('./routes/donationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

// connect to the mongoDB database
connectDB();

const app = express();

// use cookie sessions
app.use(
  session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: false,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // middleware to use req.body
app.use(cors()); // to avoid CORS errors

// initialise passport middleware to use sessions
app.use(passport.initialize());
app.use(passport.session());

// configure all the routes
app.use('/api/users', userRoutes);
app.use('/api', projectRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/auth', authRoutes);

// path for storage multer upload
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

// route for save information of stripe payment
app.post('/payment', async (req, res) => {
  let status, error;
  const { token, amount } = req.body;
  try {
    await stripe.charges.create({
      source: token.id,
      amount,
      currency: 'vnd',
    });
    status = 'success';
  } catch (error) {
    console.log(error);
    status = 'Failure';
  }
  res.json({ error, status });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(path.resolve(), '/client/build')));

  app.use('*', (req, res) =>
    res.sendFile(path.resolve(path.resolve(), 'client', 'build', 'index.html'))
  );
}

// middleware to act as fallback for all 404 errors
app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
