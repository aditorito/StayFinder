const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:['Point'],
        default:'Point'
    },
    coordinates:{
        type:[Number],
        required: true
    },
    address: {
        type:String,
        required:true
    }
})

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    location:locationSchema,
    pricePerNight:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    hostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    availability:[{
        from:Date,
        to:Date
    }]
});

const Listings = mongoose.model('Listings', listingSchema);

module.exports = Listings;

