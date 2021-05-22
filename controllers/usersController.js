const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * register function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
    const body = req.body;
    const routePath = req.route.path;

    try {
        const user = new User(body)
        // generate a salt for hash
        const salt = await bcrypt.genSalt(10);
        // hashing password
        user.password = await bcrypt.hash(user.password, salt);
        // set avatar regarding to gender if no image uploaded
        if (!user.image) {
            if (user.gender === 'Male') {
                user.avatar = 'male.jpg'
            } else {
                user.avatar = 'female.png'
            }
        } else {
            /////////////////////////////////////////////
            // image upload handling [new image name && save it on server]
            user.image = body.image;
        }
        const savedUser = await user.save();

        res.status(200).json(savedUser);
    } catch (err) {
        const handledErrors = errorsHandler(routePath, err);
        res.status(401).json(handledErrors);
    }
}


/**
 * login function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
    const {email, password} = req.body;
    const data = {};
    console.log(req.body);

    try {
        const user = await User.findOne({"email": email});
        if (!user) {
            return res.status(401).json({"error": "There is no user matches this email"})
        }
        bcrypt.compare(password, user.password, (err, matched) => {
            if (matched) {
                data.userId = user.id;
                data.username = user.username;
                data.email = user.email;
                // data.image = user.image;
                data.created_at = user.created_at;

                const token = jwt.sign({email: user.email}, process.env.SECRET_KEY)
                const expirationTime = new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION));

                // res.setHeader('set-cookie', [
                //     `token=${token}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                //     `user_id=${user.id}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                //     `username=${user.username}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                // ]);
                res.cookie("token", token, {
                    httpOnly: true,
                    expires: expirationTime,
                })

                res.cookie("email", data.email, {
                    httpOnly: true,
                    expires: expirationTime,
                })
                 
                res.cookie("userId", data.userId, {
                    httpOnly: true,
                    expires: expirationTime,
                })

                return res.status(200).json({...data});
            }
            return res.status(401).json({"error": "Password is incorrect"})
        })

    } catch (err) {
        res.status(401).json({"error": "Error log you in, try again"});
    }
}

/**
 * get user function
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getUser = async (req, res) => {
    try {
        const user = await User
            .find({email: 'sara@gmail.com'})
        return res.status(200).json(user);

    } catch (err) {
        return res.status(400).send('Error getting user');
    }
}

/**
 * update profile function
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const updateProfile = async (req, res) => {
    const routePath = req.route.path;

    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            // image: req.body.image
        }, {new: true});

        if (!user)
            return res.status(401).send('Error updating user');

        return res.status(200).json({"msg": "User updated successfully"});

    } catch (err) {
        const handledErrors = errorsHandler(routePath, err);
        return res.status(500).json(handledErrors)
    }
}

/**
 * error handler function
 * @param routePath
 * @param err
 * @returns {{}}
 */
const errorsHandler = (routePath, err) => {
    const validationErrors = {};

    if (routePath === '/register') {
        if (err.code === 11000) {
            validationErrors['email'] = 'Email already taken!';
            return validationErrors;
        }

        if (err.message.includes('User validation failed'))
            Object.values(err.errors).forEach(({properties}) => {
                validationErrors[properties.path] = properties.message;
            });
    }

    return validationErrors;
};

module.exports = {
    register,
    login,
    getUser,
    updateProfile
}
