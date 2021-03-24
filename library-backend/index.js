const { ApolloServer, gql, UserInputError, AuthenticationError} = require('apollo-server')
require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const bcrypt = require('bcrypt')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message)
    })

const typeDefs = gql`
  type Book {
    title: String!,
    published: Int!,
    author: Author,
    id: ID!,
    genres: [String]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String,
      published: Int!,
      genres: [String]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      password: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
    
  }
`

const resolvers = {
  Book: {
    author: () => {
      const id = root.author
      const bookCount = Book.find({author: id}).populate("author").countDocuments()
      const author = Author.findById({id})

      if(!author) return 
      return {
        name: author.name,
        bookCount: bookCount,
        born: author.born,
        id: author.id
      }
    }
  },

  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),

      

      allBooks: async (root, args) => {
        if (args.author && args.genre) {
          const author = await Author.findOne({ name: args.author });
  
          const books = await Book.find({
            $and: [
              { author: { $in: author.id } },
              { genres: { $in: args.genres } },
            ],
          }).populate("author");
  
          return books;
        } else if (args.author) {
          const author = await Author.findOne({ name: args.author });
  
          const books = await Book.find({ author: { $in: author.id } }).populate(
            "author"
          );
  
          return books;
        } else if (args.genres) {
          const books = await Book.find({ genres: { $in: args.genres } }).populate(
            "author"
          );
  
          return books;
        } else {
          return Book.find({}).populate("author");
        }
      },

      allAuthors: async () => 
      {
        const authors = await Author.find({})
        let booksPerAuthor = authors.map( async author => {
          const result = await Book.find({ author: author.id }).populate('author')
          const authorObject = {
            name: author.name,
            born: author.born,
            bookCount: result.length,
            id: author.id
          };
          return authorObject;
        })
        return booksPerAuthor
      },

      me: (root, args, context) => {
        return context.currentUser
      }
  },

  Mutation: {
     
      addBook: async (root, args, context) => {

        const currentUser = context.currentUser
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }

        let book
        let author = await Author.findOne({name: args.author})
        
        try {
          if(author){
            book = new Book({...args, author: author._id})
            await book.save()
          }
          if(!author){
            const author = new Author({name: args.author})
            await author.save()
            book = new Book ({...args, author: author._id})
            await book.save()
          }  
          } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }

              
        return book
      },


      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }

        let author
        author = await Author.findOne({ name: args.name })        
        if (!author) return null
        try {
        author.born = parseInt(args.setBornTo)
        await author.save()
        }  catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return author
      },

      createUser: async (root, {username, password}) => {
        let user
        try {
        const passwordHash = await bcrypt.hash(password, 10)
         user = new User({username, passwordHash})
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return user.save()
      },

      login: async (roots, {username, password}) => {

        const user = await User.findOne({username})
        const passwordCorrect = (user === null) ? false : await bcrypt.compare(password, user.passwordHash)
        if(!(user && passwordCorrect)) {
          throw new AuthenticationError("wrong credentials")
        }
        
        const userForToken = {
          username: user.username,
          id: user._id
        }
        return { value: jwt.sign(userForToken, process.env.SECRET) }
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})