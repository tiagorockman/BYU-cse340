const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}


invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  // Intentional error for testing error handling
  if (classification_id == 3) {
    throw new Error('Test error for classification ID 3')
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.invId
  const vehicle = await invModel.getInventoryByInventoryId(inventory_id)
  const vehicleHtml = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()
  const title = vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: title,
    nav,
    vehicleHtml,
  })
}

module.exports = invCont