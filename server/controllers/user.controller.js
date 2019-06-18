const User = require('../models/user.model');
const _  = require('lodash');
const errorHandler = require('./../helpers/dbErrorHandler');
/**
 * method to create a new user account
 */
const create = (req, res) => {
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({error: errorHandler.getErrorMessage(err)});
    }
    res.status(200).json({
      message: 'Successfully signed up'
    })
  });
};

/**
 * method to list all registered users
 */
const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    const returnUsers = users.map((user) => {
      const modifiedUserData = user.toJSON();
      modifiedUserData.links = {};
      modifiedUserData.links.self = `http://${req.headers.host}/api/users/${user._id}`;
      return modifiedUserData;
    });
    res.status(200).json(returnUsers)
  }).select('name email createdAt updatedAt');
};

/**
 * Utility function to retrieve a user by Id from a database
 */
const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json(
        { error: 'User not found'}
      )
    }
    req.profile = user;
    next();
  })
};
/**
 * Function to return a single user profile
 */
const read = (req, res) => {
  const userProfile = {
    name: req.profile.name,
    email: req.profile.email,
    createdAt: req.profile.createdAt,
    updatedAt: req.profile.updatedAt
  };
  return res.json(userProfile);
};

/**
 * Update user details
 */
const update = (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    const userUpdate = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    res.status(200).json(userUpdate);
  })
};
/**
 * Delete user account
 */
const remove = (req, res) => {
  let user = req.profile;
  user.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(204);
  })
};

module.exports = { create, userByID, read, list, remove, update };
