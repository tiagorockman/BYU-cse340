const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)

app.use("/error", errorRoute)


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
