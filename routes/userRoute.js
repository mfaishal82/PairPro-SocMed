const express = require('express');
const router = express.Router();

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

router.post('/home', UserController.saveNewPost)

router.get('/profile/:id', UserController.profile)
router.post('/profile/:id', UserController.saveProfile)

router.get('/logout', UserController.logout)
router.post('/profile/edit/:ProfileId', UserController.editProfile)
router.post('/tag', UserController.createTag);

router.post('/addTag/:PostId', UserController.addTag)

router.get('/dashboard', UserController.dashboard);
router.get('/delete/:UserId', UserController.deleteUser);
router.get('/admin/cetak', UserController.cetak);

module.exports = router;