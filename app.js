const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const AppError = require('./utilities/AppError');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }
    catch(e) {
        next(e);
    }
});
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res, next) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch(e) {
        next(e);
    }
})

app.get('/campgrounds/:id', async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/show', { campground });
    }
    catch(e) {
        next(e);
    }
});

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/edit', { campground });
    }
    catch(e) {
        next(e);
    }
})

app.put('/campgrounds/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch(e) {
        next(e);
    }
});

app.delete('/campgrounds/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    }
    catch(e) {
        next(e);
    }
})

app.all('*', (req, res, next) => {
    next(new AppError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {status = 500, message = 'You got an error'} = err;
    res.status(status).render('error');
})

app.listen(8080, () => {
    console.log('Serving on port 8080');
})