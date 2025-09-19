const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to build account management view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account management view
router.get("/registration", utilities.handleErrors(accountController.buildregistration));

router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router;