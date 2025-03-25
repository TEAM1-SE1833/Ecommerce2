const express = require('express');
const router = express.Router();
const Routes = require('./api/v1');

router.use('/api', Routes);

module.exports = router;