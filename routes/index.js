const express = require('express');
const router = express.Router();

// import controller
const HomeController = require('../controllers/HomeController');

router.get('/', HomeController.landingPage)
router.use('/user', require('./userRoute'))


module.exports = router;