const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')
const jwtAuth = require('../helpers/authMiddleware')

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

module.exports = router;
