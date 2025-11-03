const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const {isLoggedIn ,isOwner, validateListing , injectImage} = require("../middleware.js")

const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer ({storage})

const listingController = require("../controllers/listing.js")



//Index route to show all listings
//create route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn ,upload.single("listing[image]"),injectImage, validateListing ,wrapAsync(listingController.createListing))  //validateListing 
    
    

//Request for form to add new property
router.get("/new", isLoggedIn , listingController.renderNewForm);


//Show route
//Update Route
//Delete Router
router
    .route("/:id")
    .get(wrapAsync (listingController.showListings))
    .put(isLoggedIn,isOwner ,upload.single("listing[image]"), injectImage, validateListing ,wrapAsync (listingController.updateListing))
    .delete( isLoggedIn, isOwner ,wrapAsync (listingController.destroyRoute))



//Edit form
router.get("/:id/edit",isLoggedIn,isOwner , listingController.renderEditForm);



module.exports = router;