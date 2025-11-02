const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartDealsDBUser:MSKT2W4dkGeYVs7S@simple-crud-server.7fhuvu7.mongodb.net/?appName=simple-crud-server";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart server is running");
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Create database & product colleciton
    const db = client.db("smart_deals_db");
    const productCollection = db.collection("products");

    // Data Get
    app.get("/products", async (req, res) => {
      // product's items
      const productFields = { title: 1, price_min: 1, price_max: 1 };
      const cursor = productCollection
        .find()
        .sort({ price_min: -1 })
        .skip(2)
        .limit(5)
        .project(productFields);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Data find
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(filter);
      res.send(result);
    });

    // Data store
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // Data Update
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await productCollection.updateOne(filter, update);
      res.send(result);
    });

    // Data delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(qurey);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`smart server is running ${port}`);
});

// differen way connect database
// client
//   .connect()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`smart server is running ${port}`);
//     });
//   })
//   .catch(console.dir);
