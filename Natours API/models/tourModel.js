const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a Name.'],
        unique: true,
        trim: true
    },
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
        default: Date.now()
    },
    startDates: [String]
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;