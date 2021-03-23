const { ApolloServer, gql, UserInputError, AuthenticationError} = require('apollo-server')
require('dotenv').config()
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// /*
//  * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
//  * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
// */

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]
//const MONGODB_URI = 'mongodb+srv://jarryingnut:hesoyam10@fullstackopen.h8g22.mongodb.net/graphql?retryWrites=true&w=majority'

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
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
      allBooks: (root, args) => 
      args.author && args.author ? books.filter((book) => book.author === args.author && book.genres.includes(args.genre))
      : args.author ? books.filter((book) => book.author === args.author)
      : args.genre ? books.filter(book => book.genres.includes(args.genre))
      : books,
      allAuthors: async () => //authors.map(author => ({...author, bookCount: books.filter(book => book.author === author.name).length}))
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
      }
  },

  Mutation: {
      // addBook: (root, args) => {
      //   const book = {...args, id: uuid()}
      //   books = books.concat(book)
      //   if (!authors.find(author => author.name === book.author)) {
      //     authors = authors.concat({ name : book.author, id: uuid()})
      //   }
      //   return book
      // },

      addBook: async (root, args) => {
        let book
        let author = await Author.findOne({name: args.author})
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
        return book
      },


      // editAuthor: (root, args) => {
      //   const author = authors.find((a) => a.name === args.name);
      //   if (!author) return null;
      //   const updatedAuthor = { ...author, born: args.setBornTo };
      //   authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
      //   return updatedAuthor;
      // },

      editAuthor: async (root, args) => {
        const author = await Author.findOne({ name: args.name })        
        if (!author) return null
        author.born = parseInt(args.setBornTo)
        return author.save()
        
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})