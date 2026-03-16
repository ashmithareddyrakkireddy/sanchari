const Review = require('../models/review');
const Campground = require('../models/campground');


module.exports.makeNewReview = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Added a Review");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req,res,next)=>{
    const reviewId = req.params.reviewId;
    await Campground.findByIdAndUpdate(req.params.id,{$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Deleted a Review");
    res.redirect(`/campgrounds/${req.params.id}`);
}