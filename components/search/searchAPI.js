const config = require("../../lib/config");
const search = require('./searchController.js');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const API_URL = config.API_URL;
const API_KEY_NAME = config.API_KEY_NAME;
const API_KEY_VALUE = config.API_KEY_VALUE;

router.get('/', (req, res) => {
  res.render("search",
    { title: "Venit" }
  );
});


router.post('/',
  [
    body("address")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Street address is required.")
      .bail()
      .isLength({ max: 40 })
      .withMessage("Address is too long. Maximum length is 25 characters."),

    body("zipcode")
      .trim()
      .isPostalCode('US')
      .withMessage("Zipcode is required.")
      .bail()
      .isLength({ max: 12 })
      .withMessage("Zipcode is too long. Maximum length is 25 characters."),

    body("radius")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Radius is required.")
      .bail()
      .isInt()
      .withMessage("Only numeric characters allowed."),

    body("sicCode")
      .not().isEmpty()
      .withMessage("Please choose a business type.")

  ],

  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("search", {
        title: 'Correct Form Errors',
        errorMessages: errors.array().map(error => error.msg),
        address: req.body.address,
        zipcode: req.body.zipcode,
        radius: req.body.radius,
        sicCode: req.body.sicCode,
      });
    } else {
      next();
    }
  },
  search.submitSearch,
);

module.exports = router;

