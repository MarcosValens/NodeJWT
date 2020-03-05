const express = require('express');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('Connected to DB!'));

// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log("Server Up and running on port 3000"));

