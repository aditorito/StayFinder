const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    adult: {
        type: Number
    },
    children: {
        type: Number
    },
    infants: {
        type: Number
    }
})
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listings',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    guests: guestSchema,
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        required: true
    }

}, {
    timestamps: true,
});

const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;