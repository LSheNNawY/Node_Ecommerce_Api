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

    try {
        const user = await User.findOne({"email": email});
        if (!user) {
            return res.status(401).json({"error": "invalid credentials"})
        }
        bcrypt.compare(password, user.password, (err, matched) => {
            if (matched) {
                data.userId = user.id;
                data.username = user.username;
                data.email = user.email;
                data.image = user.image;
                data.created_at = user.created_at;

                const token = jwt.sign({email: user.email}, process.env.SECRET_KEY)
                const expirationTime = new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION));

                res.setHeader('set-cookie', [
                    `token=${token}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                    `user_id=${user.id}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                    `username=${user.username}; httpOnly=true; expires: ${expirationTime}; SameSite=None; Secure`,
                ]);

                return res.status(200).json({...data, token: token});
            }
            return res.status(401).json({"error": "invalid credentials"})
        })

    } catch (err) {
        res.status(401).json({"error": "Error log you in, try again"});
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
    login
}
