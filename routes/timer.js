// routes/timer.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const Timer = require('../models/Timer');

router.post('/start-timer', requireAuth, async (req, res) => {
  const { wish, duration } = req.body;
  const startTime = Date.now();
  const userId = req.userId;

  const timer = new Timer({ wish, duration, startTime, userId });
  await timer.save();

  res.status(201).json({ message: 'Timer started successfully' });
});

router.get('/get-timer', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const timer = await Timer.findOne({ userId });

    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    res.status(200).json({
      startTime: timer.startTime,
      duration: timer.duration,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login page if token is not present
      window.location.href = '/login.html';
      return;
    }

    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/get-timer',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const timerData = await response.json();
      displayTimer(timerData.startTime, timerData.duration);
    } else {
      console.error('Failed to fetch timer data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

module.exports = router;
