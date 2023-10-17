require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('brand shop is running...')
})

app.listen(port, () => {
  console.log(`brand shop is listening to port ${port}`)
})
