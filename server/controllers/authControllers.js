const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { signupBody } = require("../validators/auth.Schema")
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {        
        const payload = req.body;
        const { success } = signupBody.safeParse(payload)
        if (!success) {
            return res.status(400).json({
                message:"Input is Invalid",
                isauthorized:false
            })         
        }
        const existingUser = await Users.findOne({
            email:payload.email
        });
        if (existingUser) {
            return res.status(409).json({
                message:"User already exist",
                isauthorized:false
            }) 
        }
        const user = await Users.create({
            name:payload.name,
            email:payload.email,
            password:payload.password,
            role:payload.role
        })
        const userID = user._id;
        const token = jwt.sign({
            userID
        }, JWT_SECRET)

        res.status(200).json({
            token:token,
            message:"User is created",
            isauthorized:true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Somthing is wrong on the server side"
        })       
        
    }
}