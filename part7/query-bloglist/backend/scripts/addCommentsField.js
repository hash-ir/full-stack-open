require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
})
const mongoose = require('mongoose')
const config = require('../utils/config')
const Blog = require('../models/blog')

const addCommentsFieldToAllDocuments = async () => {
  try {
    const count = await Blog.countDocuments({})
    console.log(`Found ${count} documents`)
    const result = await Blog.updateMany({}, { $set: { comments: [] } })
    console.log('Completed result:', result)
    return result
  } catch (error) {
    console.error('Error updating documents:', error)
    throw error
  }
}

console.log(config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to database')
    return addCommentsFieldToAllDocuments()
  })
  .then((result) => {
    console.log(`Updated ${result.modifiedCount} documents`)
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
