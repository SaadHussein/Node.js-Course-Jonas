const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a Name.'],
        unique: true,
        trim: true,
        maxLength: [40, 'A Tour Name must be Less Than or Equal To 40'],
        minLength: [10, 'A Tour Name must be More Than or Equal To 10'],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A Tour must have a Duration.']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a Group Size.']
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a Difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty is either: easy, medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings Average Must be above or Equal To 1.0'],
        max: [5, 'Ratings Average Must be below or Equal To 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a Price.']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: "Discound Price ({VALUE}) Should Be Below Price."
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a Description.']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have an Image Cover.']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

tourSchema.virtual('durationsWeeks').get(function () {
    return this.duration / 7;
});

tourSchema.virtual('reviews', {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function (next) { This is in case we Embeding Guides Users.
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({ path: 'guides', select: "-__v -passwordChangedAt" });
    next();
});

tourSchema.post(/^find/, function (tours, next) {
    console.log(`This Took ${Date.now() - this.start} MillieSeconds.`);
    next();
});

tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;