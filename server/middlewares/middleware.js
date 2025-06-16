const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


console.log(JWT_SECRET);

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({
                message: "User doesn't have permission",
                isauthorized: false

            })
        }
        const decoded = jwt.decode(token, JWT_SECRET);
        req.usedId = decoded.usedId;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "User is not logged In",
            isauthorized: false

        })

    }
}


module.exports = authMiddleware;