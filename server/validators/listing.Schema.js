const z = require('zod');

const locationSchema = z.object({
    type:z.literal('Point'),
    coordinates:z.array(z.number()).length(2, "Coordinates must have exactly 2 number [lng, lat]"),
    address:z.string()
});

const availabilitySchema = z.object({
    from:z.string(),
    to:z.string()
})

const listingBody = z.object({
    title:z.string(),
    description:z.string(),
    location:locationSchema,
    pricePerNight:z.number(),
    images:z.array(z.string().url()),
    hostId:z.string(),
    availability:availabilitySchema
});

module.exports = {
    listingBody:listingBody
};