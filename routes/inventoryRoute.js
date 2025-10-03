const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification
router.post("/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post("/add-inventory", 
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// API route to get inventory data by classification ID (for AJAX requests)
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON));

// Public routes for visitors
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Admin routes
router.get("/edit/:invId", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

// Route to process inventory update
router.post("/update", 
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete confirm view
router.get("/delete/:invId", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirm))

// Delete action
router.post("/delete", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;