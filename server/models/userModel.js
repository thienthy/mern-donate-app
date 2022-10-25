const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
  },
  password: {
    type: String,
    required: [true, "Can't be blank"],
  },
  avatar: {
    type: String,
    default:
      'https://st4.depositphotos.com/1842549/21133/i/450/depositphotos_211337924-stock-photo-user-profile-icon-website-button.jpg',
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: true,
    default: 'Not-Active',
  },
  donationsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// function to check of passwords are matching
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
