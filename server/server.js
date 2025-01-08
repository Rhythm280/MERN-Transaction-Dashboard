const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const dummyTransactions = [
    {
        title: "Laptop",
        description: "High-performance gaming laptop",
        price: 1500,
        dateOfSale: new Date("2024-07-05"),
        category: "Electronics"
    },
    {
        title: "Running Shoes",
        description: "Comfortable running shoes for daily jogs",
        price: 80,
        dateOfSale: new Date("2024-07-10"),
        category: "Sports"
    },
    {
        title: "Coffee Maker",
        description: "Automatic drip coffee maker",
        price: 60,
        dateOfSale: new Date("2024-07-15"),
        category: "Home Appliances"
    },
    {
        title: "Book: The Lord of the Rings",
        description: "Classic fantasy novel",
        price: 25,
        dateOfSale: new Date("2024-07-20"),
        category: "Books"
    },
    {
        title: "Sunglasses",
        description: "Stylish sunglasses with UV protection",
        price: 40,
        dateOfSale: new Date("2024-07-25"),
        category: "Accessories"
    },
    {
        title: "Organic Vegetables",
        description: "Freshly picked organic vegetables",
        price: 30,
        dateOfSale: new Date("2024-07-12"),
        category: "Groceries"
    },
    {
        title: "Movie Tickets",
        description: "Tickets to the latest blockbuster movie",
        price: 20,
        dateOfSale: new Date("2024-07-18"),
        category: "Entertainment"
    },
    {
        title: "Gym Membership",
        description: "Monthly gym membership",
        price: 50,
        dateOfSale: new Date("2024-07-22"),
        category: "Health & Fitness"
    },
    {
        title: "Dinner at Restaurant",
        description: "Fine dining experience",
        price: 100,
        dateOfSale: new Date("2024-07-28"),
        category: "Dining Out"
    },
    {
        title: "Video Game",
        description: "Popular video game for console",
        price: 60,
        dateOfSale: new Date("2024-07-07"),
        category: "Entertainment"
    }
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define transaction schema
const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API to initialize the database
app.get('/api/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({}); // Clear existing data
        await Transaction.insertMany(transactions);

        res.json({ message: 'Database initialized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error initializing database' });
    }
});

// API to list transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
    const { month, page = 1, perPage = 10, search } = req.query;

    const query = {};
    if (month) {
        query.dateOfSale = { $month: parseInt(month) };
    }
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        query.$or = [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { price: { $regex: searchRegex } }, // Assuming price is stored as a string
        ];
    }

    const options = {
        sort: { dateOfSale: 1 }, // Sort by date
        skip: (page - 1) * perPage,
        limit: perPage,
    };

    try {
        const transactions = await Transaction.find(query, null, options);
        const total = await Transaction.countDocuments(query);

        res.json({
            transactions,
            pagination: {
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;

    const query = {};
    if (month) {
        query.dateOfSale = { $month: parseInt(month) };
    }

    try {
        const totalSale = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, totalSale: { $sum: '$price' } } },
        ]);
        const totalSold = await Transaction.countDocuments(query);
        const totalNotSold = 0; // Assuming a field indicating sold items

        res.json({
            totalSale: totalSale[0] ? totalSale[0].totalSale : 0,
            totalSold,
            totalNotSold,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// API for bar chart (price ranges)
app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;

    const query = {};
    if (month) {
        query.dateOfSale = { $month: parseInt(month) };
    }

    try {
        const priceRanges = await Transaction.aggregate([
            { $match: query },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    output: { count: { $sum: 1 } },
                },
            },
        ]);

        res.json(priceRanges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching bar chart data' });
    }
});


// Use this dummy data in your /api/initialize route
app.get('/api/initialize', async (req, res) => {
    try {
        await Transaction.deleteMany({}); // Clear existing data
        await Transaction.insertMany(dummyTransactions);

        res.json({ message: 'Database initialized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error initializing database' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
