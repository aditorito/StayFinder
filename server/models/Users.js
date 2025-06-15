const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["guest", "host", "admin"],
            default: "guest",
        }
    },
    {
        timestamps: true,
    }
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;


