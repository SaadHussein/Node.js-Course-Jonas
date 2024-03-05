const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception, Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected Successfully.');
});

const Port = process.env.PORT || 3000;

const server = app.listen(Port, () => {
    console.log('App Running Now.');
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection, Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});