const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectdb');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Routers
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/Enrollment');

dotenv.config(); // Loading environment variables from .env file


// Connect to the database
connectDB(); 

const app = express();

// GLOBAL MIDDLEWARE
app.use(cors(
    {
        origin: 'http://localhost:5173', // allow requests from this origin (our frontend)
        credentials: true, // allow cookies to be sent
    }
))
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // accepts form data


// ROUTE MOUNTING
app.use('/api/auth/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enroll', enrollmentRoutes);


// ERROR HANDLING MIDDLEWARE -- should be last or wont work!
app.use(notFound);
app.use(errorHandler); // custom error handler.


//  SERVER STARTUP
const PORT = process.env.PORT;

// default route
app.get('/', (req, res) => {
    res.send('EDUBRIDGE API is running successfully!');
});

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);