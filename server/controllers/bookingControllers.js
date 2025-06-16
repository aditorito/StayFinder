const { bookingBody } = require("../validators/booking.Schema");
const Bookings = require("../models/Bookings");


exports.booking = async (req, res) => {
    try {
        const payload = req.body;
        const { success } = bookingBody.safeParse(payload);
        if (!success) {
            return res.status(400).json({
                message: "Input is Invalid",
                isauthorized: false
            })
        }
        const booking =  await Bookings.create({
            userId:payload.userId,
            listingId:payload.listingId,
            checkIn:payload.checkIn,
            checkOut:payload.checkOut,
            guests:payload.guests,
            totalPrice:payload.guests,
            totalPrice:payload.totalPrice,
            status:payload.status
        });

        const status = booking.status;
        res.status(200).json({
            message:"Booking is completed",
            status:status
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side",
            isauthorized: false
        })

    }
}