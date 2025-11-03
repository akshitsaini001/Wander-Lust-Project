const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const {listingSchema} = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req , res , next) =>{
    if(! req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error" , "You must be logged in.");
        return res.redirect("/login")
    }
    next();
}


module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectURL){
        res.locals.redirectUrl = req.session.redirectURL;
    
    }
    next();
};


module.exports.isOwner = async(req , res ,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not  the owner of the Listing.");
        return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports.validateListing = (req , res, next)=>{
    let {error} = listingSchema.validate(req.body);
    

    if(error){
        throw new ExpressError(400 , error)
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async(req , res , next)=>{
    let{id , review_id} = req.params;
    let review = await Review.findById(review_id);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review.")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.injectImage = async (req , res , next)=>{
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;

        req.body.listing.image = {url , filename};

    }else if(req.params.id){
        const {id} = req.params;
        let listing = await Listing.findById(id);

        if(! listing){
            req.flash("error" , "Listing is not found for updation !")
        }

        let url = listing.image.url;
        let filename = listing.image.filename;

        req.body.listing.image = {url , filename}

        console.log("fileNAme - " ,filename);
        console.log(url);
        console.log("-------------------------------")
    }
    next();
}
