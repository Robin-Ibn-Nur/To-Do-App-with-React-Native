const express = require("express");
const cors = require('cors');
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const userDB = client.db("user").collection("users");
        const taskDB = client.db("task").collection("tasks"); // Correct the collection name to "tasks"

        app.post("/tasks", async (req, res) => { // Correct the endpoint to "/tasks"
            try {
                const { tasks } = req.body;
                const result = await taskDB.insertMany(tasks);
                console.log("result: ", result);
                console.log("newItems:", tasks);
                res.status(200).json({ message: "Tasks added successfully", result }); // Set status and send JSON data
            } catch (error) {
                console.error("Error adding tasks:", error);
                res.status(500).json({ message: "Failed to add tasks", error }); // Send an error response
            }
        });

        app.get("/users", async (req, res) => {
            try {
                const query = {};
                const result = await userDB.find(query).toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).json({ message: "Failed to fetch users", error });
            }
        });
    } finally {
        // await client.close();
        console.log("MongoDb is connected");
    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send(`To-do is running on ${port}`);
});

app.listen(port, () => console.log(`To-Do is running on ${port}`));
