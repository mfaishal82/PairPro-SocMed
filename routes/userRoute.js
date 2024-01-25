const express = require('express');
const router = express.Router();
const session = require('express-session')

// import controller
const UserController = require('../controllers/UserController');

router.get('/register', UserController.register)
router.post('/register', UserController.saveNewUser)

router.get('/login', UserController.login)
router.post('/login', UserController.verify)

router.use(function (req, res, next) {
    if(!req.session.UserId) {
        const error = 'please login first'    
        res.redirect(`/user/login?error=${error}`)
    }
    next()
})


router.get('/home', UserController.home)

router.get('/logout', UserController.logout)


module.exports = router;