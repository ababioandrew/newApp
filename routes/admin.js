const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DB_PATH = path.join(__dirname,'../models/dB.json');

function loadMembers() {
if (!fs.existsSync(DB_PATH)) return [];
const data = fs.readFileSync(DB_PATH);
return JSON.parse(data);
}

function saveMembers(data) {
fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.post('/addMembers', (req, res) => {
const members = loadMembers();
const newMember = req.body;
newMember.id = Date.now();
members.push(newMember);
saveMembers(members);
res.json({ message: 'Member added successfully', member: newMember });
});

module.exports = router;
