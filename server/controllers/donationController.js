const asyncHandler = require('express-async-handler');
const Donation = require('../models/donationModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// @desc donate to project
// @route POST /api/donations
exports.postDonate = asyncHandler(async (req, res) => {
  const { projectId, money, message } = req.body;
  const userId = req.user._id;

  const donation = new Donation({
    userId,
    projectId,
    money,
    message,
  });
  const createdDonation = await donation.save();

  // push donation ID to project database
  const project = await Project.findById(projectId);
  project.donationsId.push(donation._id);
  await project.save();

  // push donation ID to user database
  const user = await User.findById(userId);
  user.donationsId.push(donation._id);
  await user.save();

  res.status(201).json(createdDonation);
});

// @desc donate to project without login
// @route POST /api/donations/no-login
exports.postDonateWithoutLogin = asyncHandler(async (req, res) => {
  const { name, email, projectId, money, message } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const donation = new Donation({
      userId: userExists._id,
      projectId,
      money,
      message,
    });
    const createdDonation = await donation.save();

    // push donation ID to project database
    const project = await Project.findById(projectId);
    project.donationsId.push(donation._id);
    await project.save();

    // push donation ID to user database
    userExists.donationsId.push(donation._id);
    await userExists.save();

    res.status(201).json(createdDonation);
  } else {
    const newUser = new User({
      name,
      email,
      password: 123456,
    });
    await newUser.save();

    const donation = new Donation({
      userId: newUser._id,
      projectId,
      money,
      message,
    });
    const createdDonation = await donation.save();

    // push donation ID to project database
    const project = await Project.findById(projectId);
    project.donationsId.push(donation._id);
    await project.save();

    // push donation ID to user database
    newUser.donationsId.push(donation._id);
    await newUser.save();

    res.status(201).json(createdDonation);
  }
});

// @desc get user's donation information
// @route GET /api/donations/mydonations
exports.getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({})
    .populate('projectId', ['title', 'image'])
    .populate('userId', 'email')
    .sort({ createdAt: -1 });

  res.status(200).json({ donations });
});

// @desc get user's donation information
// @route GET /api/donations/mydonations
exports.getUserDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ userId: req.params.id })
    .populate('projectId')
    .sort({ createdAt: -1 });

  if (donations) {
    res.status(200).json({ donations });
  } else {
    res.status(404);
    throw new Error('Donation not found');
  }
});

// @desc get user's donation information by ID
// @route GET /api/donations/:id
exports.getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ userId: req.user._id })
    .populate('projectId', ['title', 'image'])
    .sort({ createdAt: -1 });

  if (donations) {
    res.status(200).json({ donations });
  } else {
    res.status(404);
    throw new Error('Donation not found');
  }
});
