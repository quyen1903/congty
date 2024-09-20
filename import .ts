require('dotenv').config()

import connectDB from'./src/database/connect';
import Project from'./src/models/project.model';

const jsonProducts = require('./Db.json')

const start = async () => {
  try {
    await connectDB('mongodb://localhost:27017/Employee')
    await Project.deleteMany()
    await Project.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()