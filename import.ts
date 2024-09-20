require('dotenv').config()

const connectDB = require('./src/database/connect')
const Product = require('./src/model/project.model')

const jsonProducts = require('./Db.json')

const start = async () => {
  try {
    await connectDB('mongodb://localhost:27017/Employee')
    await Product.deleteMany()
    await Product.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()