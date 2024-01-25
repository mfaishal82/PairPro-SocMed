const express = require('express');
const router = express.Router();

// import controller
const UserController = require('../controllers/UserController');

router.get('/login', UserController.login)
router.post('/login', UserController.verify)

router.get('/register', UserController.register)
router.post('/register', UserController.saveNewUser)

router.get('/home', UserController.home)



module.exports = router;