const jwtSecret = 'your_jwt_secret'; // MUST match key in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username being encoded
        expiresIn: '7d', // Specifies 7 day expiration
        algorithm: 'HS256' // Algorithm used to encode JWT values
    });
};


module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right.',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token }); // Return user token (ES6 shorthand)
            });
        })(req, res);
    });
};