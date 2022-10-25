const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect, admin } = require('../middleware/authMIddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// get all donations
router.get('/', protect, admin, donationController.getDonations);

// donate to project
router.post('/', protect, donationController.postDonate);

// donate to project without login
router.post('/no-login', donationController.postDonateWithoutLogin);

// get user's donation information
router.get('/my-donations', protect, donationController.getMyDonations);

// get user's donation information by ID
router.get('/:id', protect, admin, donationController.getUserDonations);

// route for save information of stripe payment
router.post('/payment', async (req, res) => {
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
    status = 'failure';
  }
  res.json({ error, status });
});

module.exports = router;
