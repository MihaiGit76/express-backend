// Express backend for LessonApp — handles lessons and orders
const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Logger middleware: logs every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static file middleware: serves lesson images
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const PORT = process.env.PORT || 3030;

// Use your Atlas connection string
const uri = "mongodb+srv://mihaiserbanus_db_user:Test1234@cluster0.gosj8rl.mongodb.net/?retryWrites=true&w=majority";

// Create one MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let lessons;

// Routes
app.post('/orders', async (req, res) => {
  const order = req.body;
  try {
    const db = client.db('lessonApp');
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ message: 'Order saved', orderId: result.insertedId });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Search lessons by keyword across multiple fields
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q; // e.g. /search?q=math
    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    const results = await lessons.find({
      $or: [
        { subject: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { price: { $regex: query, $options: 'i' } },
        { spaces: { $regex: query, $options: 'i' } }
      ]
    }).toArray();

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

app.put('/lesson/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updateData = req.body; // e.g. { spaces: 3, price: 120 }

    const result = await lessons.updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Lesson updated successfully' });
    } else {
      res.status(400).json({ error: 'Lesson not found or no changes applied' });
    }
  } catch (err) {
    console.error('Error updating lesson:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Start server and connect to MongoDB
async function startServer() {
  try {
    await client.connect();
    const db = client.db('lessonApp');
    lessons = db.collection('lesson');
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();

