const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {getUser, editProfile, updateProfile} = require('../controllers/UserController')
=======
const usersController = require('../controllers/usersController')
const jwtAuth = require('../helpers/authMiddleware')
>>>>>>> master

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* POST register. */
router.post('/register', async function (req, res, next) {
    await usersController.register(req, res);
});

/* POST login. */
router.post('/login', async function (req, res, next) {
    await usersController.login(req, res);
});


/* GET User Logout */
router.post('/logout', jwtAuth, async (req, res) => {
    res.clearCookie('token')
    res.clearCookie('user_id')
    res.clearCookie('username')

    return res.status(200).json({"msg": "Logged out"})
});

router.get('/profile', getUser);

// router.get('/edit/:id', editProfile);

router.put('/:id', updateProfile);

module.exports = router;
