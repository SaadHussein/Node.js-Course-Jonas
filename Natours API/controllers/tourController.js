const Tour = require('../models/tourModel');

const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "failed",
            message: "Missing Name or Price"
        });
    }

    next();
};

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        // data: { tours },
        // results: tours.length
    });
};

const getTour = (req, res) => {
    const id = +req.params.id;
    // const selectedTour = tours.find(tour => tour.id === id);

    // if (!selectedTour) {
    //     return res.status(404).json({
    //         status: "failed",
    //         message: "Can not Find Tour"
    //     });
    // }


    res.status(200).json({
        status: 'success',
        data: { selectedTour },
    });
};

const createTour = (req, res) => {
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);

    res.status(201).json({
        message: "success",
        // eslint-disable-next-line prettier/prettier
        data: {
            // tour: newTour,
        }
    });
};

const updateTour = (req, res) => {
    const id = +req.params.id;

    res.status(200).json({
        status: "success",
        data: {
            tour: "This is Updated Tour."
        }
    });
};

const deleteTour = (req, res) => {
    const id = +req.params.id;

    res.status(204).json({
        status: "success",
        data: null
    });
};

module.exports = {
    getAllTours, createTour, getTour, updateTour, deleteTour, checkBody
};