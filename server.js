// Express backend for LessonApp — CST3144

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();

// ---- MIDDLEWARE ----
app.use(cors());            // ✅ Allowed and required for GitHub Pages → Render
app.use(express.json());

// Logger middleware (required by marking criteria)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static images middleware (required by marking criteria)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ---- CONFIG ----
const PORT = process.env.PORT || 3030;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let lessons;

// ---- API ROUTES ----

// GET all lessons  this route gets all the lessons from the lesson collection on Mongodb
app.get('/lessons', async (req, res) => {
  try {
    const results = await lessons.find().toArray();
    console.log("Fetched lessons count:", results.length);
    res.json(results);
  } catch (err) {
    console.error('Fetch lessons error:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// POST new order
app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    const db = client.db('lessonApp');
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({
      message: 'Order saved',
      orderId: result.insertedId
    });
  } catch (err) {
    console.error('Save order error:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// SEARCH lessons
app.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Missing search query' });

    const results = await lessons.find({
      $or: [
        { subject:  { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { price:    { $regex: q, $options: 'i' } },
        { spaces:   { $regex: q, $options: 'i' } }
      ]
    }).toArray();

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search lessons' });
  }
});

// UPDATE lesson
app.put('/lesson/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updateData = req.body;

    const result = await lessons.updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Lesson updated successfully' });
    } else {
      res.status(400).json({ error: 'Lesson not found or unchanged' });
    }
  } catch (err) {
    console.error('Lesson update error:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// ---- START SERVER ----
async function startServer() {
  try {
    await client.connect();
    lessons = client.db('lessonApp').collection('lessons');

    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();
