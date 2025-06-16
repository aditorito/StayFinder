const { Children } = require('react');
const z = require('zod');

const guestSchema = z.object({
    adult:z.string(),
    Children:z.string().optional(),
    infants:z.string().optional()
});

const bookingBody = z.object({
    userId: z.string(),
    listingId: z.string(),
    checkIn:z.string(),
    guests:guestSchema,
    totalPrice:z.number(),
    status:z.string()
});

module.exports = {
    bookingBody:bookingBody
}