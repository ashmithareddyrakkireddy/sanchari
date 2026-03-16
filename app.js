if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
require("./instrument.js");
const Sentry = require("@sentry/node");
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground.js');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');
const { campgroundSchema, reviewSchema } = require('./utils/validateSchema.js');
const Review = require('./models/review.js');
const User =require('./models/user.js');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require("./routes/users.js");  
const session = require('express-session');
const mongoStore= require('connect-mongo');
const flash = require('connect-flash');
const passport=require('passport');
const passportLocal = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
// console.log(process.env.cloudinary_name)
// npm install cloudinary@1.41.3

// npm install multer-storage-cloudinary@4.0.0

// npm install multer@1.4.5-lts.1

const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';

const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionconfig = { 
    store,
    secret : 'secretkey',resave : false,
    saveUninitialized: true,
    cookie :{
        httpOnly:true,
        // secure:true,
        expires : Date.now()+1000*60*60,
        maxAge : 1000*60*60,
        httpOnly :true
    }
}
const app = express();


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://js.sentry-cdn.com/c7dc86652408016ebbc87ef9237bcddf.min.js",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dej07g3oj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionconfig));
app.use(flash());
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success= req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);


// Optional fallthrough error handler
app.get("/debug-sentry", function mainHandler(req, res,next) {
        console.log("dnubfeqw");
      throw new Error("My second Sentry error!");
});


app.get('/', (req, res) => {
    res.render("home");
})

Sentry.setupExpressErrorHandler(app);

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'errorrrrr' } = err;
    res.status(statusCode).render('error', { err });
})


app.listen(3000, (req, res) => {
    console.log('listening')
})