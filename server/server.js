const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const CORS = require('cors');
const rootRouter = require('./routes/index')
const connectDB = require('./config.js/db')

dotenv.config();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(CORS());
const PORT = process.env.PORT;
connectDB();


app.use("/api/v1/", rootRouter);


app.listen(PORT, ()=>{
    console.log("Server is running on " + PORT);
})
