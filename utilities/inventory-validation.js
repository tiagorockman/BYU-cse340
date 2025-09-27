const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be alphabetic only
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 30 })
      .withMessage("Classification name must be between 2 and 30 characters.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only alphabetic characters (no spaces, numbers, or special characters).")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists) {
          throw new Error("Classification name already exists. Please choose a different name.")
        }
      }),
  ]
}

/*  **********************************
  *  Check data and return errors or continue to add classification
  * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make (minimum 3 characters)."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model (minimum 3 characters)."),

    // inv_year is required and must be 4-digit year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits.")
      .matches(/^\d{4}$/)
      .withMessage("Year must contain only numbers.")
      .custom((value) => {
        const year = parseInt(value)
        const currentYear = new Date().getFullYear()
        if (year < 1900 || year > currentYear + 1) {
          throw new Error(`Year must be between 1900 and ${currentYear + 1}.`)
        }
        return true
      }),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),

    // inv_image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    // inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    // inv_price is required and must be positive number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // inv_miles is required and must be positive integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),

    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid color."),

    // classification_id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),
  ]
}

/*  **********************************
  *  Check data and return errors or continue to add inventory
  * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate