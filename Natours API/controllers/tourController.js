const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        return res.status(200).json({
            status: "success",
            data: {
                tours: tours
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    };
};

const getTour = async (req, res) => {
    try {
        const id = req.params.id;
        const selectedTour = await Tour.findById(id);

        return res.status(200).json({
            status: "success",
            data: {
                tour: selectedTour
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        return res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            status: "success",
            data: {
                tour: updateTour
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        const id = req.params.id;
        await Tour.findByIdAndDelete(id);

        return res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

module.exports = {
    getAllTours, createTour, getTour, updateTour, deleteTour
};