const z = require('zod');

const guestSchema = z.object({
    adults:z.number().min(1,"At least one adult is required"),
    children:z.number().optional(),
    infants:z.number().optional()
});

const bookingBody = z.object({
    userId: z.string(),
    listingId: z.string(),
    checkIn:z.string(),
    checkOut:z.string(),
    guest:guestSchema,
    totalPrice:z.number().positive(),
    status: z.enum(["pending", "confirmed", "cancelled"])
});

module.exports = {
    bookingBody:bookingBody
}