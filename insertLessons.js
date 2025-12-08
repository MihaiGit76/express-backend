// insertLessons.js
const { MongoClient } = require('mongodb');

// Replace with your Atlas connection string
const uri = "mongodb+srv://mihaiserbanus_db_user:Test1234@cluster0.gosj8rl.mongodb.net/lessonApp?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("lessonApp");
    const lessons = db.collection("lesson");

    const sampleLessons = [
      { subject: "Math", location: "London", price: 25, spaces: 5 },
      { subject: "English", location: "Harrow", price: 30, spaces: 6 },
      { subject: "Science", location: "Birmingham", price: 40, spaces: 7 },
      { subject: "History", location: "Manchester", price: 35, spaces: 8 },
      { subject: "Geography", location: "Leeds", price: 28, spaces: 9 },
      { subject: "Physics", location: "Glasgow", price: 45, spaces: 10 },
      { subject: "Chemistry", location: "Liverpool", price: 42, spaces: 11 },
      { subject: "Biology", location: "Sheffield", price: 38, spaces: 12 },
      { subject: "Art", location: "Nottingham", price: 20, spaces: 13 },
      { subject: "Music", location: "Newcastle", price: 22, spaces: 14 }
    ];

    const result = await lessons.insertMany(sampleLessons);
    console.log(`Inserted ${result.insertedCount} lessons`);
  } catch (err) {
    console.error("Error inserting lessons:", err);
  } finally {
    await client.close();
  }
}

run();
