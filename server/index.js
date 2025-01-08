const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transaction_db', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define transaction schema
const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  dateOfSale: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API to initialize the database with sample data (optional)
app.get('/api/initialize', async (req, res) => {
  try {
    await Transaction.deleteMany({}); 

    const sampleTransactions = [
      {
        title: "Laptop",
        description: "High-performance gaming laptop",
        price: 1500,
        dateOfSale: new Date("2024-07-05"),
        category: "Electronics",
      },
      {
        title: "Running Shoes",
        description: "Comfortable running shoes for daily jogs",
        price: 80,
        dateOfSale: new Date("2024-07-10"),
        category: "Sports",
      },
      // Add more sample transactions here
    ];

    await Transaction.insertMany(sampleTransactions);

    res.json({ message: 'Database initialized successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error initializing database' });
  }
});

// API to get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
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
      ];
    }

    const options = {
      sort: { dateOfSale: -1 }, // Sort by date in descending order
      skip: (page - 1) * perPage,
      limit: perPage,
    };

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

// API to get transaction statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const { month } = req.query;

    const query = {};
    if (month) {
      query.dateOfSale = { $month: parseInt(month) };
    }

    const totalSale = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalSale: { $sum: '$price' } } }, 
    ]);

    const totalSold = await Transaction.countDocuments(query);

    res.json({
      totalSale: totalSale[0] ? totalSale[0].totalSale : 0, 
      totalSold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// API to get bar chart data (price ranges)
app.get('/api/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;

    const query = {};
    if (month) {
      query.dateOfSale = { $month: parseInt(month) };
    }

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});