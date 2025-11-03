const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req , res )=>{
    let listing =await Listing.findById(req.params.id);

    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Added Successfully !");
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.destroyRoute = async(req , res)=>{
    let{id , review_id} = req.params;
    await Review.findByIdAndDelete(review_id);
    await Listing.findByIdAndUpdate(id , {$pull: {reviews : review_id}});
    req.flash("success" , "Review Deleted !");
    res.redirect(`/listings/${id}`);
}