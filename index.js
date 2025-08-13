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
    const usercollection = database.collection('users')
    const bookingcollection = database.collection('books')

      app.post('/books', async (req, res) => {
      const event = req.body;
      const result = await bookingcollection.insertOne(event);
      res.send(result);
    });



    //add event in database
    app.post('/addeven', async (req, res) => {
      const event = req.body;
      const result = await evencollection.insertOne(event);
      res.send(result);
    });

    // get all event data 
    app.get('/alleven', async (req, res) => {
      try {
        const result = await evencollection.find().sort({ _id: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Node/Express (server)
    const { ObjectId } = require("mongodb");

    app.get("/event/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid event id" });
        }

        const event = await evencollection.findOne({ _id: new ObjectId(id) });
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json(event);
      } catch (err) {
        console.error("GET /event/:id error:", err);
        res.status(500).json({ message: "Error fetching event", error: err.message });
      }
    });


    //add user 
    // add user
    app.post("/users", async (req, res) => {
      try {
        const { name, email, photo } = req.body;

        // Check if user already exists
        const existingUser = await usercollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // New user with default role "student"
        const newUser = {
          name,
          email,
          photo,
          role: "student", // Default role
          createdAt: new Date()
        };

        await usercollection.insertOne(newUser);

        res.status(201).json({ message: "User saved successfully", user: newUser });
      } catch (err) {
        res.status(500).json({ message: "Error saving user", error: err.message });
      }
    });

    app.get("/alluser", async (req, res) => {
      try {
        const users = await usercollection.find().sort({ createdAt: -1 }).toArray();
        res.status(200).json(users); // Make sure it's an array
      } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
      }
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
