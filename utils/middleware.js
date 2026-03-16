const catchAsync = require("./catchAsync");
const Campground =require('../models/campground');
const ExpressError = require('./ExpressError');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('./validateSchema');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"you must be logged in first");
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = catchAsync(async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"you don't have permission");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
})

module.exports.isAuthorofReview = catchAsync(async (req,res,next)=>{
    const review = await Review.findById(req.params.reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"you don't have permission");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
})

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}