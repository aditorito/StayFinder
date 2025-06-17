const { bookingBody } = require("../validators/booking.Schema");
const Bookings = require("../models/Bookings");
const Listings = require("../models/Listings");


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
        const booking = await Bookings.create({
            userId: payload.userId,
            listingId: payload.listingId,
            checkIn: payload.checkIn,
            checkOut: payload.checkOut,
            guests: payload.guests,
            totalPrice: payload.guests,
            totalPrice: payload.totalPrice,
            status: payload.status
        });

        const property = await Listings.findById(payload.listingId);
        const oneDay = 24 * 60 * 60 * 1000;
        const availabiltyBlocks = property.availability;
        const checkIn = booking.checkIn;
        const checkOut = booking.checkOut;
        const updateAvailabliltyBlock = (availabiltyBlocks, checkIn, checkOut) => {
            
            const newBlocks = [];

            for (let block of availabiltyBlocks) {
                if (checkIn >= block.from && checkOut <= block.to) {

                    const checkInTime = checkIn.getTime();
                    const checkOutTime = checkOut.getTime();
                    const fromTime = block.from.getTime();
                    const toTime = block.to.getTime();


                    if (checkInTime === fromTime && checkOutTime < toTime) {

                        block.from = new Date(checkOutTime + oneDay);
                        newBlocks.push(block);

                    } else if (checkInTime > fromTime && checkOutTime === toTime) {

                        block.to = new Date(checkIn.getTime() - oneDay);
                        newBlocks.push(block);

                    } else if (checkIn > block.from && checkOut < block.to) {

                        const firstBlock = {
                            from: block.from,
                            to: new Date(checkInTime - oneDay)
                        };

                        const secondBlock = {
                            from: new Date(checkOutTime + oneDay),
                            to:block.to
                        };
                        newBlocks.push(firstBlock, secondBlock);

                    }

                }else{
                    newBlocks.push(block);
                }

            }
            return newBlocks;
        }
        property.availability = updateAvailabliltyBlock(property.availability, checkIn, checkOut);

        await property.save();


        const status = booking.status;
        res.status(200).json({
            message: "Booking is completed",
            status: status
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side",
            isauthorized: false
        })

    }
}