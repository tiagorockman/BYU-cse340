const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const baseController = require("./controllers/baseController")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
/*Session*/
const session = require("express-session")
const pool = require('./database/')

const bodyParser = require("body-parser")

/*Cookie*/
const cookieParser = require("cookie-parser")



/* ***********************
 * Engine
 * ************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Middleware
 * ************************/
app.use(cookieParser())
app.use(utilities.checkJWTToken)


 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))


/* ***********************
 * Route
 * ************************/
app.use("/inv", inventoryRoute)
app.use("/error", errorRoute)
app.use("/account", accountRoute)


app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  // Add nav to request object for the error handler
  req.nav = nav
  
  // Handle 500 errors with our custom handler
  if(err.status == 500 || !err.status) {
    return utilities.handleServerError(err, req, res, next)
  }
  
  // Handle 404 errors
  if(err.status == 404){ 
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


const port = process.env.PORT
const host = process.env.HOST


app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
