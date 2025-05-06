import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB, getDB } from "./db/connections.js";
import { ObjectId } from "mongodb"

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
    const db = getDB();
    const todosCollection = db.collection("todos");
  
    app.get("/todos", async (req, res) => {
      try {
        const todos = await todosCollection.find().toArray();
        res.json(todos);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch todos" });
      }
    });
  
    app.post("/todos", async (req, res) => {
      try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });
  
        const newTodo = { text };
        const result = await todosCollection.insertOne(newTodo);
        res.status(201).json({ _id: result.insertedId, ...newTodo });
      } catch (err) {
        res.status(500).json({ error: "Failed to add todo" });
      }
    });
  
    app.put("/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { text} = req.body;
  
        const result = await todosCollection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { text} },
          { returnDocument: "after" }
        );
  
        if (!result.value) return res.status(404).json({ error: "Todo not found" });
  
        res.json(result.value);
      } catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
      }
    });
  
    app.delete("/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }
  
        const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });
  
        if (result.deletedCount === 0) return res.status(404).json({ error: "Todo not found" });
  
        res.json({ message: "Todo deleted",id });
      } catch (err) {
        console.error("Error in DELETE /todos/:id", err);
        res.status(500).json({ error: "Failed to delete todo" });
      }
    });
  
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to start the server.", err);
  });