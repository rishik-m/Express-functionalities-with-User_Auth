const express = require('express');
const router = express.Router();
const AppError = require('../utilities/AppError');
const Campground = require('../models/campground');

router.get('/', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }
    catch (e) {
        next(e);
    }
});
router.get('/new', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('success', "You must be logged in!!");
        return res.redirect('/login');
    }
    res.render('campgrounds/new');
});

router.post('/', async (req, res, next) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', 'A new Campground is successfully created!!');
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch (e) {
        next(e);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('reviews');
        res.render('campgrounds/show', { campground });
    }
    catch (e) {
        next(e);
    }
});

router.get('/:id/edit', async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/edit', { campground });
    }
    catch (e) {
        next(e);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Campground Deleted!!');
        res.redirect('/campgrounds');
    }
    catch (e) {
        next(e);
    }
})

module.exports = router;