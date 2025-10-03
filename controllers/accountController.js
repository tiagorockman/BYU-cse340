const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
//password hash
const bcrypt = require("bcryptjs")

//JWT
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildregistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
  })
}

/* ****************************************
 *  Logout handler - clear JWT cookie and redirect to login
 * ************************************ */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  const accountId = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const account = res.locals.accountData
  // Ensure the requested account matches the logged-in account
  if (!account || account.account_id !== accountId) {
    req.flash("notice", "Access denied.")
    return res.redirect("/account/")
  }
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account.account_id
  })
}

/* ****************************************
*  Process account info update
* *************************************** */
async function updateAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let nav = await utilities.getNav()
  try {
    const updated = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    if (updated) {
      // Refresh JWT with latest account data so views reflect changes immediately
      const freshAccount = await accountModel.getAccountById(account_id)
      if (freshAccount) {
        const accessToken = jwt.sign(freshAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
      }
      req.flash("notice", "Account information updated.")
      return res.redirect("/account/")
    }
    req.flash("notice", "Update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  } catch (e) {
    req.flash("notice", "Update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
*  Process password change
* *************************************** */
async function updatePassword(req, res, next) {
  const { account_id, account_password } = req.body
  let nav = await utilities.getNav()
  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10)
    const updated = await accountModel.updatePassword(account_id, hashedPassword)
    if (updated) {
      req.flash("notice", "Password updated.")
      return res.redirect("/account/")
    }
    req.flash("notice", "Password update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null
    })
  } catch (e) {
    req.flash("notice", "Password update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null
    })
  }
}

module.exports = { buildLogin, buildregistration, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildAccountUpdate, updateAccount, updatePassword }
