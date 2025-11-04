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

    // Create database & product & bids colleciton
    const db = client.db("smart_deals_db");
    const productCollection = db.collection("products");
    const bidsCollection = db.collection("bids");
    const usersCollection = db.collection("users");

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const femail = newUser.email;
      const query = { email: femail };
      const exitingUser = await usersCollection.findOne(query);
      
      if (exitingUser) {
        res.send({
          message: "user already exits. do not need to insert again",
        });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // Data Get
    app.get("/products", async (req, res) => {
      // product's items
      const productFields = { title: 1, price_min: 1, price_max: 1 };
      // const cursor = productCollection
      //   .find()
      //   .sort({ price_min: -1 })
      //   .skip(2)
      //   .limit(5)
      //   .project(productFields);

      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = productCollection.find(query);
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

    // Bids Related Apis
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    app.patch("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBid = req.body;
      const filter = { _id: new ObjectId(id) };

      const update = {
        $set: {
          buyer_name: updatedBid.buyer_name,
          buyer_email: updatedBid.buyer_email,
        },
      };
      const result = await bidsCollection.updateOne(filter, update);
      res.send(result);
    });

    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(query);
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
