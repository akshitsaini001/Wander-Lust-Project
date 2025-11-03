const User = require("../models/user.js")

module.exports.renderSignUpForm = (req , res) =>{
    res.render("user/signUpPage.ejs")
};

module.exports.singUp = async(req , res) =>{
    try{
        let {username , password , email} = req.body;
        const newUser =  new User ({email, username});
        const registeredUser = await User.register(newUser ,  password);


        req.login( registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to wanderLust.")
            res.redirect("/listings")
        });

    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup")
    }

};

module.exports.renderLogInForm = (req , res)=>{
    res.render("user/loginPage.ejs");
};

module.exports.logIn =  async(req , res)=>{
    req.flash("success" , "You are logged in successfully !")
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logOut =  (req , res , next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out!");
        res.redirect("/listings")
    })
};