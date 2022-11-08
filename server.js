const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
//adding schema
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const app = express()

//Using a static database for tutorials
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt)},
        author: {
         type: AuthorType,
         resolve: (book) => {
            return authors.find(author => author.id === book.authorId)
        }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(author => author.authorId === author.id)
            }
        }
    })
})

//Creating Root query
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
    book: {
      type: BookType,
      description: 'A single book',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
     },
      books: {
      type: new GraphQLList(BookType),
      description: 'List of books',
      resolve: () => books
     },
     authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of authors',
      resolve: () => authors
     },
     author: {
      type: AuthorType,
      description: 'A single author',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => authors.find(book => book.id === args.id)
     }
    })
})

//Creating schema
const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Server running')) 