const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    rating: {
        type: Number,
        min: 0, // 0 means not rated yet
        max: 5,
        default: 0
    },
});

module.exports = mongoose.model('Reservation', ReservationSchema);