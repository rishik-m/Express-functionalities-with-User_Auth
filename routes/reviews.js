const express = require('express');
const router = express.Router({mergeParams: true});
const AppError = require('../utilities/AppError');
const Review = require('../models/review');
const Campground = require('../models/campground');

router.post('/', async(req, res) => {
    try {
        const result = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        result.reviews.push(review);
        await review.save();
        await result.save();
        req.flash('success', 'New review added!!');
        res.redirect('/campgrounds');
    }
    catch(e) {
        console.log(e);
    }
});

router.delete('/:reviewId', async(req, res) => {
    try {
        const {id, reviewId} = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review Deleted!!');
        res.redirect('/campgrounds');
    } 
    catch(e) {
        console.log(e);
    }
});

module.exports = router;