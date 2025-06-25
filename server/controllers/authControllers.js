const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { signupBody, signinBody } = require("../validators/auth.Schema");
const Listings = require("../models/Listings");
const Bookings = require("../models/Bookings");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
        const payload = req.body;
        const { success } = signupBody.safeParse(payload)
        if (!success) {
            return res.status(400).json({
                message: "Input is Invalid",
                isauthorized: false
            })
        }
        const existingUser = await Users.findOne({
            email: payload.email
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exist",
                isauthorized: false
            })
        }
        const user = await Users.create({
            name: payload.name,
            email: payload.email,
            password: payload.password,
            role: payload.role
        })
        const userId = user._id;
        let isHost = false;
        if (user.role == 'host') {
            isHost = true;
        }
        const token = jwt.sign({
            userId
        }, JWT_SECRET)

        res.status(200).json({
            token: token,
            message: "User is created",
            isauthorized: true,
            isHost
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side",
            isauthorized: false
        })

    }
}

exports.login = async (req, res) => {
    try {
        const payload = req.body;
        const { success } = signinBody.safeParse(payload);
        if (!success) {
            return res.status(400).json({
                message: "Input is Invalid",
                isauthorized: false
            })
        };

        const existingUser = await Users.findOne({
            email: payload.email
        });

        if (existingUser.password !== payload.password) {
            return res.status(401).json({
                message: "Incorrect password",
                isauthorized: false

            });
        }


        if (!existingUser) {
            return res.status(404).json({
                message: "User doesn't exist!!",
                isauthorized: false
            })
        }
        let isHost = false;
        if (existingUser.role == 'host') {
            isHost = true;
        }

        const userId = existingUser._id;
        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        res.status(200).json({
            token: token,
            isauthorized: true,
            isHost: isHost
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side",
            isauthorized: false
        })

    }
}

exports.getUserdetails = async (req, res) => {
    try {
        const id = req.userId;
        const user = await Users.findById(id);
        let listedProperty;
        if (user.role == 'host') {
            listedProperty = await Listings.find({
                hostId: id
            })
        }
        const response = {
            message: "Fetched user details",
            data: user
        }
        const bookings = await Bookings.find({
            userId: id
        });
        console.log(bookings);

        if (bookings) {
            response.bookings = bookings
        }
        if (listedProperty) {
            response.listedProperty = listedProperty
        }

        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Somthing is wrong on the server side",
            isauthorized: false
        })


    }
}