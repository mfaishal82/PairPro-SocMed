const express = require('express');
const router = express.Router();

// import controller
const IndexController = require('../controllers/IndexController');

router.get('/', IndexController.landingPage)
router.use('/user', require('./userRoute'))


module.exports = router;