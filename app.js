const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/saveAttendance'));
app.use('/', require('./routes/addMembers'));
app.use('/', require('./routes/saveToDB'));
app.use('/', require('./routes/main'));


const sendView = (view) => (req, res) =>
res.sendFile(path.join(__dirname, 'public/views', `${view}.html`));

const pages= ['/','/details','/attendance','/viewAttendance','/addMembers','/saveAttendance','saveToDB','/users','/allMembers','/birthdayPage','/admin', '/members', '/data', '/dashboard'];
pages.forEach((route) => {const view = route === '/' ? 'index' : route.slice(1); app.get(route, sendView(view))});

app.listen(PORT, () => console.log(`Server has started and running on port: ${PORT}`));
