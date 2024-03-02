const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a Name.'],
        unique: true,
        trim: true
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
        required: [true, 'A Tour must have a Difficulty.']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a Price.']
    },
    priceDiscount: Number,
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
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

tourSchema.virtual('durationsWeeks').get(function () {
    return this.duration / 7;
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre('/^find/', function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post('/^find/', function (tours, next) {
    console.log(`This Took ${Date.now() - this.start} MillieSeconds.`);
    next();
});

tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;