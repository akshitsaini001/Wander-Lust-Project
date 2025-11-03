require('dotenv').config()


const express = require("express");
const app = express();
const port = 8080;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const path = require("path");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname , "public")));

app.set("view engine"  , "ejs");
app.set("views" , path.join(__dirname , "/views"));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

const ejsMate = require("ejs-mate");
app.engine("ejs" , ejsMate);

const ExpressError = require("./utils/ExpressError.js");

const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_ATLAS;
 
main()
    .then((res)=>{
        console.log("Connected to database.")
    })
    .catch(err => console.log("ERROR" , err));

async function main() {
  await mongoose.connect(dbUrl);

}

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo'); 

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error" , ()=>{
    console.log("ERROR in MONGO STORE SESSION", err)
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.get("/demo" ,async (req , res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"Delta-Student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser)
// })





//Listening 
app.listen(port , ()=>{
    console.log("App is listening on the port 8080.")
})

app.use((req , res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/listings" ,listingsRouter );
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);





app.use((req , res , next)=>{
    next(new ExpressError( 404 , "Page not found"));
})
app.use((err ,req , res , next)=>{
    let {statusCode = 500 , message = "Error"}= err;
    res.status(statusCode).render("error.ejs" , {message})
});