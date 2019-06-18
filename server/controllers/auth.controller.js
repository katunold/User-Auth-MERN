const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../config/config');

/**
 * function to perform authentication on user login
 */
const signIn = (req, res) => {
  User.findOne({
    'email': req.body.email
  }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({ error: 'User not found'});
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({error: 'Email and Password dont match'});
    }
    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret, { expiresIn: 60*60});

    return res.status(200).send({
      accessToken: token,
      user: {_id: user._id, name: user.name, email: user.email}
    })

  })
};

/**
 * function to logout an authenticated user
 */
const logout = (req, res) => {
  return res.status(200).send({
    message: 'Logged out'
  })
};
/**
 * function to check user authentication status
 * @type {middleware}
 */
const requireSignIn = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
});

/**
 * function to check user authorization status
 */
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
  if (!authorized) {
    return res.status(403).send({
      error: 'User is not authorised'
    });
  }
  next();
};

module.exports = { signIn, logout, requireSignIn, hasAuthorization };
