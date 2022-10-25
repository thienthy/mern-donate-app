const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  money: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Donation', donationSchema);
