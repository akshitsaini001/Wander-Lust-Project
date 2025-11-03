const Listing = require("../models/listing.js");
const {validateListing} = require("../middleware.js");

module.exports.index =  async (req , res)=>{
    const allListings =await Listing.find();
    res.render("listing/index.ejs" , {allListings});
};

module.exports.renderNewForm =  (req , res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListings = async (req , res)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id).populate({path: "reviews", populate : {path : "author"}}).populate("owner")
    if(! listing){
        req.flash("error" , "Listing you requested does not exist.");
        return res.redirect("/listings")
    }
    res.render("listing/show.ejs" , {listing})
};

module.exports.createListing = async (req , res , next)=>{
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    const {error} = validateListing;
    if(error){
        req.flash("error" , "Something is wrong")
    }
    console.log(newListing)
    await newListing.save();
    req.flash("success" , "New Listing Created Successfully !");
    res.redirect("/listings")   
};


module.exports.renderEditForm = wrapAsync (async(req , res)=>{
    let {id} = req.params;

    let listing =await Listing.findById(id);

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload" , "/upload/h_300,w_250")
    res.render("listing/edit.ejs" , {listing , originalUrl})
})

module.exports.updateListing = async  (req , res)=>{
    if(! req.body.listing){
        throw new ExpressError(400 , "Send a valid data.")
    }
    let {id} = req.params;
    let listing =await Listing.findById(id);
    
    let updatedListing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});

    console.log(updatedListing);

    // if(typeof req.file !== "undefined"){
    //     let url = req.file.path;
    //     let filename = req.file.filename;
    //     req.body.listing.image = { url, filename };

            
    // }
    req.flash("success" , "Listing updated Successfully !");
    res.redirect(`/listings/${id}`)
};

module.exports.destroyRoute = async (req , res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted Successfully !");
    res.redirect("/listings");
};