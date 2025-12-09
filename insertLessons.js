// insertLessons.js
const { MongoClient } = require('mongodb');
require('dotenv').config(); 

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("lessonApp");
    const lessonCollection = db.collection("lessons");

    // Clear existing lessons to prevent duplicates
    await lessonCollection.deleteMany({});

    const sampleLessons = [
  { subject: "Math", location: "London", price: 25, spaces: 5, image: "https://express-backend-7apr.onrender.com/images/math.png" },
  { subject: "English", location: "Harrow", price: 30, spaces: 6, image: "https://express-backend-7apr.onrender.com/images/english.png" },
  { subject: "Science", location: "Birmingham", price: 40, spaces: 7, image: "https://express-backend-7apr.onrender.com/images/science.png" },
  { subject: "History", location: "Manchester", price: 35, spaces: 8, image: "https://express-backend-7apr.onrender.com/images/history.png" },
  { subject: "Geography", location: "Leeds", price: 28, spaces: 9, image: "https://express-backend-7apr.onrender.com/images/geography.png" },
  { subject: "Physics", location: "Glasgow", price: 45, spaces: 10, image: "https://express-backend-7apr.onrender.com/images/physics.png" },
  { subject: "Chemistry", location: "Liverpool", price: 42, spaces: 11, image: "https://express-backend-7apr.onrender.com/images/chemistry.png" },
  { subject: "Biology", location: "Sheffield", price: 38, spaces: 12, image: "https://express-backend-7apr.onrender.com/images/biology.png" },
  { subject: "Art", location: "Nottingham", price: 20, spaces: 13, image: "https://express-backend-7apr.onrender.com/images/art.png" },
  { subject: "Music", location: "Newcastle", price: 22, spaces: 14, image: "https://express-backend-7apr.onrender.com/images/music.png" }
];

    const result = await lessonCollection.insertMany(sampleLessons);
    console.log(`Inserted ${result.insertedCount} lessons`);
  } catch (err) {
    console.error("Error inserting lessons:", err);
  } finally {
    await client.close();
  }
}

run();
