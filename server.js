import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import mongoose from 'mongoose';
import User from './models/userModel.js';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(path.resolve(), 'public')));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Profile API',
            version: '1.0.0',
            description: 'API for managing user profiles',
            contact: {
                name: 'Your Name',
            },
            servers: ["http://localhost:3000"]
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// connect to the database
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process if connection fails
    }
};
connectToDatabase();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    const __dirname = path.resolve(); // Resolve the directory name
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
});

// Validate user profile data
const validateUserProfile = (userData) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\d{10}$/;
    const birthdayPattern = /^\d{2}-\d{2}-\d{4}$/;

    if (!emailPattern.test(userData.email)) {
        throw { code: 400, message: 'Bad Request', error: 'Invalid email format', data: null };
    }

    if (!mobilePattern.test(userData.mobile)) {
        throw { code: 400, message: 'Bad Request', error: 'Invalid mobile number length', data: null };
    }

    if (!birthdayPattern.test(userData.birthday)) {
        throw { code: 400, message: 'Bad Request', error: 'Invalid birthday format', data: null };
    }

    const [day, month, year] = userData.birthday.split('-').map(Number);
    const age = new Date().getFullYear() - year;
    if (age < 18) {
        throw { code: 400, message: 'Bad Request', error: 'Age must be greater than 18', data: null };
    }
};

// Create user profile
app.post('/api/user', async (req, res) => {
    try {
        validateUserProfile(req.body); // Validate user profile data

        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json({ code: 200, message: 'User created successfully', error: false, data: null });
    } catch (err) {
        if (err.code === 400) {
            res.status(400).json({ code: 400, message: 'Bad Request', error: err.error, data: null });
        } else {
            res.status(500).json({ code: 500, message: 'Internal Server Error', error: err.message, data: null });
        }
    }
});



// Route to get user by name
app.get('/api/user/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found', error: true, data: null });
        }
        res.status(200).json({ code: 200, message: 'User found', error: false, data: user });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error', error: err.message, data: null });
    }
});

// Route to update user details
app.put('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found', error: true, data: null });
        }
        res.status(200).json({ code: 200, message: 'User updated successfully', error: false, data: user });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error', error: err.message, data: null });
    }
});

// delete api 
app.delete('/api/user/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const user = await User.findOneAndDelete({ name });

        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found', error: true, data: null });
        }

        res.status(200).json({ code: 200, message: 'User deleted successfully', error: false, data: null });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal Server Error', error: err.message, data: null });
    }
});


