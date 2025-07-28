const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const DB_PATH = path.join(__dirname, '../models/saveAttendance.json');

function saveRecord(record, res) {
const { type, name, gender, ageGroup, date, comment } = record;

if (!type || !name || !gender || !ageGroup || !date || !comment) {
return res.status(400).json({ message: "Missing required fields." });
}

let allData = [];
if (fs.existsSync(DB_PATH)) {
allData = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

allData.push({ type, name, gender, ageGroup, date, comment });
fs.writeFileSync(DB_PATH, JSON.stringify(allData, null, 2));

return res.json({ message: "Attendance saved successfully!" });
}

router.post("/saveAttendance", (req, res) => {
saveRecord(req.body, res);
});

router.get("/saveAttendance", (req, res) => {
const { type, name, gender, ageGroup, date, comment } = req.query;

if (type && name && gender && ageGroup && date && comment) {
return saveRecord(req.query, res);
}

if (!fs.existsSync(DB_PATH)) {
return res.json([]);
}

const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
res.json(data);
});

module.exports = router;
