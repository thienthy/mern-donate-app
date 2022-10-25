const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  desc: {
    type: String,
  },
  targetDonation: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  donationsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
    },
  ],
  post: {
    type: String,
  },
  status: {
    type: String,
    default: 'Donate',
  },
  remainTime: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Project', projectSchema);
