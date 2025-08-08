const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

try {
app.use('/attendance', require('./routes/saveAttendance'));
app.use('/members', require('./routes/addMembers'));
app.use('/db', require('./routes/saveToDB'));
app.use('/', require('./routes/main'));
} catch (err) {console.error('Error loading route files:', err)}

const sendView = (view) => (req, res) => {
const filePath = path.join(__dirname, 'public/views', `${view}.html`);
fs.access(filePath, fs.constants.F_OK, (err) => {if(err){console.error(`View not found: ${filePath}`); return res.status(404).send('Page not found')}; res.sendFile(filePath)});
};

const pages = ['/', '/details', '/attendance', '/viewAttendance', '/addMembers','/saveAttendance', '/saveToDB', '/users', '/allMembers','/birthdayPage', '/admin', '/members', '/data', '/dashboard'];
pages.forEach((route) => {const view = route === '/' ? 'index' : route.slice(1); app.get(route, sendView(view))});

app.use((req, res, next) => {res.status(404).send('Page not found')});
app.use((err, req, res, next) => {console.error('Unhandled error:', err); res.status(500).send('Something broke!')});

app.listen(PORT, () => {console.log(`Server has started and is running on port: ${PORT}`)});
