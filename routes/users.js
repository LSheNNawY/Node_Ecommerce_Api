const express = require('express');
const router = express.Router();
const {getUser, editProfile, updateProfile} = require('../controllers/UserController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', getUser);

// router.get('/edit/:id', editProfile);

router.put('/:id', updateProfile);

module.exports = router;
