const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const DB_PATH = path.join(__dirname, "../models/saveAttendance.json");

router.post("/saveAttendance", (req, res) => {
try {
const { type, name, gender, ageGroup, date, comment } = req.body;

if (!type || !name || !gender || !ageGroup || !date || !comment) {
console.error("Missing fields:", req.body);
return res.status(400).json({ message: "Missing required fields." });
}

let allData = [];
if (fs.existsSync(DB_PATH)) {
allData = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

allData.push({ type, name, gender, ageGroup, date, comment });
fs.writeFileSync(DB_PATH, JSON.stringify(allData, null, 2));

res.json({ message: "Attendance saved successfully!" });
} catch (err) {
console.error("Error saving attendance:", err);
res.status(500).json({ message: "Server error." });
}
});

// Optional: get all attendance records
router.get("/saveAttendance", (req, res) => {
if (!fs.existsSync(DB_PATH)) return res.json([]);
const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
res.json(data);
});

module.exports = router;

