const express = require('express')
const router=express.Router({mergeParams : true});

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../utils/validateSchema');
const Review = require('../models/review');
const Campground = require('../models/campground');

const reviews = require('../controllers/reviews');
const {validateReview,isLoggedIn,isAuthor,isAuthorofReview} = require("../utils/middleware");


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.makeNewReview))

router.delete('/:reviewId',isLoggedIn,isAuthorofReview,catchAsync(reviews.deleteReview))

module.exports = router;