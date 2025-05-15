require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const User = require('./models/user')
const Book = require('./models/book')
const jwt = require('jsonwebtoken')
const DataLoader = require('dataloader')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const batchBookCounts = async (authorIds) => {
  const counts = await Book.aggregate([
    {
      $match: {
        author: {
          $in: authorIds.map(
            (id) => new mongoose.Types.ObjectId(id.toString())
          ),
        },
      },
    },
    { $group: { _id: '$author', count: { $sum: 1 } } },
  ])

  const countMap = {}
  counts.forEach((result) => {
    countMap[result._id.toString()] = result.count
  })

  return authorIds.map((id) => {
    const count = countMap[id.toString()] || 0
    return count
  })
}

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const bookCountLoader = new DataLoader(batchBookCounts)

        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser, bookCountLoader }
        }

        return { bookCountLoader }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
    console.log(`Subscription endpoint ready at ws://localhost:${PORT}`)
  })
}

start()
