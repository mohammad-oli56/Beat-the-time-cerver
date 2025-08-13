// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// তোমার MongoDB URI এখানে .env থেকে নেওয়া উচিত,
// কিন্তু তুমি কোডে সরাসরি দিয়েছো, এটা ঠিক আছে ডেভেলপমেন্টের জন্য।
const uri = "mongodb+srv://olimohammad286:LbnQbnWCSadYCqXL@cluster0.0hjlhc7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());

// MongoDB ক্লায়েন্ট তৈরি
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // await client.connect();
    const database = client.db("even-data");
    const evencollection = database.collection('event');


    app.post('/addeven', async (req, res) => {
            const event = req.body;
            const result = await evencollection.insertOne(event);
            res.send(result);
        });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
  try {
    const database = client.db('beat_the_clock_db');
    const collection = database.collection('testcollection');
    const docs = await collection.find({}).toArray();

    // সাধারণ টেক্সট হিসেবে রেসপন্স
    let responseText = 'Hello from Express & MongoDB server!\n\nData:\n';
    docs.forEach((doc, index) => {
      responseText += `${index + 1}. ${JSON.stringify(doc)}\n`;
    });

    res.send(responseText);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
