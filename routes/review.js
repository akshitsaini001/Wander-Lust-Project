const express = require("express");
const router = express.Router( {mergeParams : true});
const Review = require("../models/reviews.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js")
const validateReview = (req , res, next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400 , error)
    }else{
        next();
    }
}
const {reviewSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controllers/reviews.js")



//Post review route
router.post("/",isLoggedIn, validateReview ,wrapAsync(reviewController.createReview));


//Delete review route
router.delete("/:review_id", isLoggedIn, isReviewAuthor ,wrapAsync (reviewController.destroyRoute));

module.exports = router;