const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@node-express.sczsc.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect()

    const brandCollection = client.db('brandShop').collection('brands')
    const userCollection = client.db('brandShop').collection('users')
    const addedProductCollection = client
      .db('brandShop')
      .collection('addedProducts')

    app.get('/brands', async (req, res) => {
      const result = await brandCollection.find().toArray()
      res.send(result)
    })

    app.get('/brands/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await brandCollection.findOne(query)
      res.send(result)
    })

    app.post('/brands', async (req, res) => {
      const newProduct = req.body
      const result = await brandCollection.insertOne(newProduct)
      res.send(result)
    })

    app.put('/brands/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedBrand = req.body

      const brand = {
        $set: {
          name: updatedBrand.name,
          brandName: updatedBrand.brandName,
          type: updatedBrand.type,
          price: updatedBrand.price,
          rating: updatedBrand.rating,
          image: updatedBrand.image,
        },
      }

      const result = await brandCollection.updateOne(query, brand, options)
      res.send(result)
    })

    app.delete('/brands/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await brandCollection.deleteOne(query)
      res.send(result)
    })

    // user related endpoints
    app.get('/user', async (req, res) => {
      const cursor = userCollection.find()
      const users = await cursor.toArray()
      res.send(users)
    })

    app.post('/user', async (req, res) => {
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/user', async (req, res) => {
      const user = req.body
      const query = { email: user.email }
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt,
        },
      }
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // att to cart related endpoints

    app.get('/addedproducts', async (req, res) => {
      const result = await addedProductCollection.find().toArray()
      res.send(result)
    })

    app.get('/addedproducts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addedProductCollection.findOne(query)
      res.send(result)
    })

    app.post('/addedproducts', async (req, res) => {
      const newProduct = req.body
      const result = await addedProductCollection.insertOne(newProduct)
      res.send(result)
    })

    app.delete('/addedproducts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addedProductCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('brand shop is running...')
})

app.listen(port, () => {
  console.log(`brand shop is listening to port ${port}`)
})
