const { listingBody } = require("../validators/listing.Schema");
const Listing = require("../models/Listings");


exports.listingProperty = async (req, res) => {
    try {
        const payload = req.body;
        const { success } = listingBody.safeParse(payload);
                
        if (!success) {
            return res.status(400).json({
                message: "Input is invalid"
            })

        }
        await Listing.create({
            title: payload.title,
            description: payload.description,
            location: payload.location,
            pricePerNight: payload.pricePerNight,
            images: payload.images,
            hostId: payload.hostId,
            availability: payload.availability
        });
        res.status(200).json({
            message: "Property listed"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side"
        })

    }
}

exports.getlistedProperty = async (req, res) => {
    try {
        const listedProperty = await Listing.find({});

        res.status(200).json({
            message: "Listing fetched",
            data: listedProperty
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side"
        })

    }
}

exports.getSpecificProperty = async (req, res) => {
    try {
        const id = req.params.id;
        const Property = await Listing.findById(id);

        if (!Property) {
            return res.status(404).json({
                message: "Property doesn't exist!!",
                isauthorized: false
            })
        }

        res.status(200).json({
            message:"Property found",
            data:Property
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side"
        })

    }
}
