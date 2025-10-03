const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account management view
router.get("/registration", utilities.handleErrors(accountController.buildregistration));

router.post('/register', regValidate.registationRules(), regValidate.checkRegData,
             utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Update account view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Process account update
router.post(
  "/update-account",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;