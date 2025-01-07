const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
});

const { MongoClient } = require('mongodb');

const uri = "mongodb://<username>:<password>@<host>:<port>/<database>"; 

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    // Your database operations here
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

module.exports = mongoose.model('Product', ProductSchema);