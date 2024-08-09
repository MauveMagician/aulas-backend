const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Configuração do MongoDB para a API
const { MongoClient } = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017";
const MONGODB_DB = "mydatabase";

let db;

app.prepare().then(async () => {
  const server = express();
  server.use(express.json());

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db(MONGODB_DB);
  console.log("Connected to MongoDB");

  // Example API route
  server.get("/api/data", async (req, res) => {
    const data = await db.collection("mycollection").find({}).toArray();
    res.json(data);
  });

// Handle POST request to add data to MongoDB
  server.post("/api/data", async (req, res) => {
    const { name, species } = req.body;
    const result = await db.collection("mycollection").insertOne({ name, species });
    res.status(200).json({ message: "Cadastro concluído com sucesso", data: result });
  });

  // Default catch-all handler to allow Next.js to handle all other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});