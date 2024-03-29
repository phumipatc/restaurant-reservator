const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const restaurantsRouter = require('./routes/restaurants');
const authRouter = require('./routes/auth');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurants', restaurantsRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	  PORT,
	  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	  console.log(`Error: ${err.message}`);
	  server.close(() => process.exit(1));
});