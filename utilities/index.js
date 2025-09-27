const invModel = require("../models/inventory-model")
const Util = {}

Util.getImagePath = function(imagePath, isThumbnail = false) {
  const defaultImage = '/images/vehicles/no-image.png'
  const defaultThumbnail = '/images/vehicles/no-image-tn.png'
  
  if (!imagePath) {
    return isThumbnail ? defaultThumbnail : defaultImage
  }
  
  return imagePath
}

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  const defaultThumbnail = '/images/vehicles/no-image-tn.png';
  
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      const thumbnailImage = Util.getImagePath(vehicle.inv_thumbnail, true);
      
      grid += '<li>'
      grid += '<a href="../../inv/detail/'+ vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model + ' details">'
      grid +=  '<img src="' + thumbnailImage 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" onerror="this.onerror=null; this.src=\'' + defaultThumbnail + '\'" />'
      grid += '</a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      // Price at the bottom
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetail = async function(vehicle){
  const defaultImage = '/images/vehicles/no-image.png';
  
  const vehicleImage = Util.getImagePath(vehicle.inv_image, false);
  
  let detail = '<div class="vehicle-detail">';
  detail += '<div class="vehicle-image">';
  detail += `<img src="${vehicleImage}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" onerror="this.onerror=null; this.src='${defaultImage}'">`;
  detail += '</div>';
  detail += '<div class="vehicle-info">';
  detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  detail += `<p class="vehicle-price">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  
  detail += '<div class="vehicle-specs">';
  detail += '<div class="spec-item">';
  detail += '<span class="spec-label">Year</span>';
  detail += `<span class="spec-value">${vehicle.inv_year}</span>`;
  detail += '</div>';
  
  detail += '<div class="spec-item">';
  detail += '<span class="spec-label">Color</span>';
  detail += `<span class="spec-value">${vehicle.inv_color}</span>`;
  detail += '</div>';
  
  detail += '<div class="spec-item">';
  detail += '<span class="spec-label">Mileage</span>';
  detail += `<span class="spec-value">${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</span>`;
  detail += '</div>';
  detail += '</div>';
  
  detail += '<div class="vehicle-description">';
  detail += '<h3>Description</h3>';
  detail += `<p>${vehicle.inv_description}</p>`;
  detail += '</div>';
  
  detail += '</div>';
  detail += '</div>';
  return detail;
}

/* ****************************************
 * Middleware to build classification list for dropdown
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.handleServerError = (err, req, res, next) => {
  console.error(`Error: ${err.message}`)
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: err.message,
    nav: req.nav
  })
}

module.exports = Util