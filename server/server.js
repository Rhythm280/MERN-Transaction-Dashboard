const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request'); 

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Product model
const Product = require('./models/Product'); 

// API to initialize the database with seed data
app.get('/initialize-data', async (req, res) => {
    try {
        const response = await request('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = JSON.parse(response.body);

        for (const product of data) {
            const newProduct = new Product({
                title: product.title,
                description: product.description,
                price: product.price,
                dateOfSale: new Date(product.dateOfSale),
                category: product.category || 'Other', // Set default category if not present
            });

            await newProduct.save();
        }

        res.json({ message: 'Database initialized with seed data' });
    } catch (err) {
        console.error('Error fetching or saving data:', err);
        res.status(500).json({ message: 'Error initializing database' });
    }
});

// API to list transactions with search and pagination
app.get('/transactions', async (req, res) => {
    const { search, page = 1, perPage = 10 } = req.query;
    const month = req.query.month ? parseInt(req.query.month) : null; 

    let filter = {};
    if (month) {
        filter.dateOfSale = { $month: month }; 
    }

    if (search) {
        const regex = new RegExp(search, 'i'); // Case-insensitive search
        filter = { 
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { price: { $regex: regex } } // Assuming price is stored as a string
            ] 
        };
    }

    try {
        const count = await Product.countDocuments(filter);
        const totalPages = Math.ceil(count / perPage);

        const skip = (page - 1) * perPage;
        const limit = perPage;

        const transactions = await Product.find(filter, null, { skip, limit }).sort({ dateOfSale: -1 });

        res.json({
            transactions,
            currentPage: page,
            totalPages,
            totalCount: count,
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// API for transaction statistics
app.get('/statistics', async (req, res) => {
    const month = req.query.month ? parseInt(req.query.month) : null; 

    const filter = month ? { $month: month } : {};

    try {
        const totalSales = await Product.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const totalSold = await Product.countDocuments({ ...filter }); // Assuming all products are sold
        const totalNotSold = 0; // Assuming all products are sold

        res.json({
            totalSales: totalSales[0] ? totalSales[0].total : 0,
            totalSold,
            totalNotSold,
        });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// API for bar chart (price ranges)
app.get('/bar-chart', async (req, res) => {
    const month = req.query.month ? parseInt(req.query.month) : null; 

    const filter = month ? { $month: month } : {};

    try {
        const priceRanges = await Product.aggregate([
            { $match: filter },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        res.json(priceRanges);
    } catch (err) {
        console.error('Error fetching bar chart data:', err);
        res.status(500).json({ message: 'Error fetching bar chart data' });
    }
});

// API for pie chart (categories)
app.get('/pie-chart', async (req, res) => {
    const month = req.query.month ? parseInt(req.query.month) : null; 

    const filter = month ? { $month: month } : {};

    try {
        const categories = await Product.aggregate([
            { $match: filter },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.json(categories);
    } catch (err) {
        console.error('Error fetching pie chart data:', err);
        res.status(500).json({ message: 'Error fetching pie chart data' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});