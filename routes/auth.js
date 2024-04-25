const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// user registration

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate user input
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the user to the database
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// User Login

// User Login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.setHeader('Access-Control-Allow-Origin', 'https://dg-delta.vercel.app');
  res.status(200).json({ token });
});

// Inside your backend route for starting the timer
router.post('/start-timer', async (req, res) => {
  const { duration } = req.body;

  // Extract the user ID from the token
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  // Use the userId to perform actions specific to the user

  // Respond with success
  res.status(200).json({ message: 'Timer started successfully.' });
});

module.exports = router;
