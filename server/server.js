const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const CORS = require('cors');
const rootRouter = require('./routes/index')
const connectDB = require('./config.js/db')

dotenv.config();
app.use(bodyParser.json());
app.use(CORS());
const PORT = process.env.PORT;
connectDB();


app.use("/api/v1/", rootRouter);


app.listen(PORT, ()=>{
    console.log("Server is running on " + PORT);
})
