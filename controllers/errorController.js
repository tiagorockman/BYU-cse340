const utilities = require("../utilities/")
const errorController = {}


errorController.triggerError = async function(req, res, next) {
  // Intentionally throw an error to trigger the 500 error page
  throw new Error("This is an intentional 500 error for testing purposes")
}

module.exports = errorController