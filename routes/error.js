const express = require('express');

const router = express.Router();

//Login Page
router.get('/*', (req, res) => res.send('error'));

module.exports = router;