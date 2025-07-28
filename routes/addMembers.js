const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../models/dB.json');
const loadData = () => {
try {
const data = fs.readFileSync(dbFilePath, 'utf8');
return JSON.parse(data);
} catch (err) {
return [];
}
};
const saveData = (data) => {
fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
};

router.post('/addMembers', (req, res) => {
const newMember = req.body;
if (!newMember.name || !newMember.email || !newMember.phone || !newMember.gender || !newMember.dob || !newMember.age || !newMember.status) {
return res.status(400).json({ message: 'All fields are required.' });
}

const data = loadData();

// Optional: Check for duplicate email or phone
if (data.some(m => m.email === newMember.email)) {
return res.status(409).json({ message: 'Email already exists.' });
}

// Assign a simple unique ID
newMember.id = Date.now().toString();

data.push(newMember);
try {
saveData(data);
res.json({ message: 'Member saved successfully!' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Failed to save member.' });
}
});

module.exports = router;
