
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.get('/', user.getdata);

module.exports = router;
