
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbFilePath = path.join(__dirname, '../models/dB.json');

// Utility to load DB
const loadData = () => {
  try {
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error loading DB:', err.message);
    return null;
  }
};

// Utility to save DB
const saveData = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err.message);
    return false;
  }
};

// 📥 POST /addMembers - Save a new member
router.post('/addMembers', (req, res) => {
  const newMember = req.body;
  if (!newMember.name || !newMember.email || !newMember.phone || !newMember.gender || !newMember.dob || !newMember.age || !newMember.status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const data = loadData();
  if (!data) return res.status(500).json({ message: 'Failed to load database' });

  // Check for duplicates (by email)
  if (data.some(m => m.email === newMember.email)) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  // Add ID and push new member
  newMember.id = Date.now().toString();
  data.push(newMember);

  if (saveData(data)) {
    res.json({ message: 'Member saved successfully!' });
  } else {
    res.status(500).json({ message: 'Failed to save member.' });
  }
});

// 📤 GET /saveToDB or /saveToDB/:id
router.get('/saveToDB/:id?', (req, res) => {
  const data = loadData();
  if (!data) return res.status(500).json({ message: 'Failed to load database' });

  const { id } = req.params;
  if (id) {
    const user = data.find(u => u.id == id);
    return user ? res.json(user) : res.status(404).json({ message: 'User not found' });
  }

  const members = data;
  const now = new Date();

  const totalUsers = members.length;
  const totalBirthdays = members.filter(m => {
    if (!m.dob) return false;
    const dob = new Date(m.dob);
    return dob.getMonth() === now.getMonth();
  }).length;

  const genderCounts = members.reduce((acc, curr) => {
    const gender = (curr.gender || '').toLowerCase();
    if (gender.includes("male")) acc.Male = (acc.Male || 0) + 1;
    else if (gender.includes("female")) acc.Female = (acc.Female || 0) + 1;
    else acc.Unknown = (acc.Unknown || 0) + 1;
    return acc;
  }, {});

  const statusCounts = members.reduce((acc, curr) => {
    const status = (curr.status || 'Unknown').trim();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const ageRanges = {
    '1-17': 0,
    '18-35': 0,
    '36-49': 0,
    '50-100': 0
  };

  members.forEach(m => {
    let age = Number(m.age);
    if (!age && m.dob) {
      const birthDate = new Date(m.dob);
      age = now.getFullYear() - birthDate.getFullYear();
      const mDiff = now.getMonth() - birthDate.getMonth();
      if (mDiff < 0 || (mDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    if (!isNaN(age)) {
      if (age <= 17) ageRanges['1-17']++;
      else if (age <= 35) ageRanges['18-35']++;
      else if (age <= 49) ageRanges['36-49']++;
      else if (age <= 100) ageRanges['50-100']++;
    }
  });

  res.json({ totalUsers, totalBirthdays, genderCounts, statusCounts, ageRanges, members });
});

module.exports = router;
