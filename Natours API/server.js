const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected Successfully.');
});

const Port = process.env.PORT || 3000;
console.log('Hi');

app.listen(Port, () => {
    console.log('App Running Now.');
});