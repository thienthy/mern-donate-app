const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const sendEmail = require('../utils/sendEmail');

// @desc register new user
// @route POST /api/users/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  // if user was created successfully
  if (user) {
    const token = generateToken(user._id, 'access');
    const url = `${process.env.FRONTEND_BASE_URL}/users/${user._id}/verify/${token}`;

    // send a mail for email verification of the newly registred email id
    await sendEmail(user._id, email, url, 'email verification');

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      status: user.status,
      token: token,
      message: 'An Email sent to your account please verify',
    });
  } else {
    res.status(400).json({ message: 'Invalid user' });
  }
});

// @desc authenticate user and get token
// @route POST /api/users/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // if the passwords are matching, then check the account status
  if (user && (await user.matchPassword(password))) {
    if (user.status === 'Not-Active') {
      return res.status(404).json({ message: 'Account has not been verified' });
    } else if (user.status === 'Deleted') {
      return res.status(404).json({ message: 'Account has been deleted' });
    } else if (user.status === 'Denied') {
      return res.status(404).json({ message: 'Account has been denied' });
    } else {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        status: user.status,
        token: generateToken(user._id, 'access'),
      });
    }
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

// @desc verify account from link send to mail
// @route GET /api/users/:id/verify/:token
exports.verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (user) {
    user.status = 'Active';
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid link');
  }
});

// @desc send a mail with the link to reset password
// @route POST /api/users/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res
      .status(200)
      .json({ message: 'This email is not registered in our system' });
  }

  const token = generateToken(user._id, 'forgot password');
  const url = `${process.env.FRONTEND_BASE_URL}/users/reset-password/${user._id}/${token}`;

  // send a link to email to reset password
  await sendEmail(user._id, email, url, 'forgot password');

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
    status: user.status,
    token: token,
    message: 'Password reset link send successfully in your email',
    statusCode: 201,
  });
});

// @desc change new password
// @route PUT /api/users/reset-password/:id
exports.resetPassword = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  console.log(id);
  const user = await User.findOne({ _id: id });
  if (user) {
    user.password = password;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        status: updatedUser.status,
      });
    } else {
      res.status(401);
      throw new Error('Unable to update password');
    }
  }
});

// @desc login by Google
// @route POST /api/users/passport/data
exports.getUserDataGoogle = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(id);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      status: user.status,
      token: generateToken(user._id, 'access'),
    });
  } else {
    res.status(400);
    throw new Error('User not authorised to view this page');
  }
});

// @desc get data for an authenticated user
// route GET /api/users/profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      status: user.status,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc update data for an authenticated user
// route PUT /api/users/profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      status: updatedUser.status,
      token: generateToken(updatedUser._id, 'access'),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all the users info
// @route GET /api/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .populate('donationsId')
    .sort({ createdAt: -1 });
  res.status(200).json({ users });
});

// @desc Get a user by id
// @route GET /api/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Add new user
// @route POST /api/users
exports.addUser = asyncHandler(async (req, res) => {
  const newUser = new User({ ...req.body });
  const savedUser = await newUser.save();
  res.status(200).json(savedUser);
});

// @desc Update a user
// @route PUT /api/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.isAdmin = req.body.isAdmin;
    user.status = req.body.status;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      status: updatedUser.status,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Delete a user
// @route DELETE /api/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json({ message: 'User has been deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Delete a user failed when they have been donated
// @route PUT /api/users/delete-failed/:id
exports.deleteUserFailed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.status = 'Deleted';
    await user.save();
    res
      .status(200)
      .json({ message: 'This user has been donated. You cannot delete.' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
