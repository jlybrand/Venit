const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require('./usersController.js');

router.get('/register', (req, res) => {
  res.render('register', 
  { title: "Register" });
})

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/register',
  [
    body("firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name is required.")
      .bail(),

    body("lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name is required.")
      .bail(),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide your email.")
      .bail(),

    body("username")
      .isLength({ min: 3 })
      .withMessage("Username is required.")
      .bail(),

    body("password")
      .isLength({ min: 3 })
      .withMessage("Password is required.")
      .bail()

  ],

  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", {
        errorMessages: errors.array().map(error => error.msg),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      });
    } else {
      next();
    }
  },

  userController.createUser,
);

router.post('/signin', (req, res) => {
  res.send(`Submitting sign in form not yet implemented.`)
})

module.exports = router;