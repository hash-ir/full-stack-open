const { GraphQLError, subscribe } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const DataLoader = require('dataloader')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({}).populate('author')
      } else if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        return await Book.find({
          author: author._id,
          genres: args.genre,
        }).populate('author')
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        return await Book.find({ author: author._id }).populate('author')
      } else {
        return await Book.find({ genres: args.genre }).populate('author')
      }
    },
    allAuthors: async () => {
      console.log('Author.find')
      return await Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Author: {
    bookCount: async (root, args, context) => {
      // const count = await Book.countDocuments({ author: root._id })
      // console.log('Book count')
      // return count
      const count = await context.bookCountLoader.load(root._id)
      console.log(`Got book count for author ${root.name}: ${count}`)
      return count
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({ name: args.author })
          await author.save().catch((error) => {
            throw new GraphQLError('Adding author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error,
              },
            })
          })
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        await book.save()

        // First retrieve the populated book to get complete data
        const populatedBook = await Book.findById(book._id).populate('author')

        // Convert to plain object after populating
        const bookObject = populatedBook.toObject
          ? populatedBook.toObject()
          : populatedBook

        // Now published the fully populated, plain object
        pubsub.publish('BOOK_ADDED', {
          bookAdded: bookObject,
        })

        // Return the populated book (no need to query again)
        return populatedBook
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
