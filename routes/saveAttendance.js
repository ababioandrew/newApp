const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const DB_PATH = path.join(__dirname, '../models/saveAttendance.json');

// POST attendance
router.post("/saveAttendance", (req, res) => {

const { type, name, gender, ageGroup, date, comment } = req.body;

if (!type || !name || !gender || !ageGroup || !date || !comment){return res.status(400).json({ message: "Missing required fields." })}

const record = { type, name, gender, ageGroup, date, comment };
let allData = [];
if(fs.existsSync(DB_PATH)){allData = JSON.parse(fs.readFileSync(DB_PATH, "utf8"))}
allData.push(record); fs.writeFileSync(DB_PATH, JSON.stringify(allData, null, 2));

res.json({ message: "Attendance saved successfully!" });
});

// GET attendance
router.get("/saveAttendance", (req, res) => {if (!fs.existsSync(DB_PATH)) {return res.json([])}
const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8")); res.json(data)});

module.exports = router;
