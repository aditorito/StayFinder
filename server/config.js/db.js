const mongoose = require('mongoose');

const connectWithMongoDB = async () => {
    try {
        const connectionIntance = await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is Connected ", connectionIntance.connection.host);
        
    } catch (error) {
        console.log(error);
        console.log("Somthing is up with Database");
               

    }

}

module.exports = connectWithMongoDB;