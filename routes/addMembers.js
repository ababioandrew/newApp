const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../models/dB.json');

const readDB = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
    }
    return [];
  } catch (err) {
    console.error('Error reading DB file:', err.message);
    return [];
  }
};

router.get('/stats', (req, res) => {
  const members = readDB();

  // 1. Total Users
  const totalUsers = members.length;

  // 2. Total Birthday Celebrants
  const today = new Date();
  const currentMonth = today.getMonth();
  const celebrants = members.filter(member => {
    if (!member.dob) return false;
    const dob = new Date(member.dob);
    return dob.getMonth() === currentMonth;
  });

  const totalBirthdays = celebrants.length;

  // 3. Gender Breakdown
  const genderCounts = members.reduce((acc, member) => {
    acc[member.gender] = (acc[member.gender] || 0) + 1;
    return acc;
  }, {});

  // 4. Marital Status
  const statusCounts = members.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {});

  // 5. Age Ranges
  const ageRanges = {
    '1-17': 0,
    '18-35': 0,
    '36-49': 0,
    '50-100': 0,
  };

  const currentYear = today.getFullYear();
  members.forEach(member => {
    if (!member.dob || !member.age) return;
    const dob = new Date(member.dob);
    const age = member.age || currentYear - dob.getFullYear();

    if (age <= 17) ageRanges['1-17']++;
    else if (age <= 35) ageRanges['18-35']++;
    else if (age <= 49) ageRanges['36-49']++;
    else if (age <= 100) ageRanges['50-100']++;
  });

  res.json({
    totalUsers,
    totalBirthdays,
    genderCounts,
    statusCounts,
    ageRanges
  });
});


module.exports = router;