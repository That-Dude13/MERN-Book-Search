const {gql} = require('apollo-server-express');

const typeDefs = gql`

input SaveBookInput {
    authors: [String]
    description: String
    title: String
    bookId: [bookId]
    image: String
    link: String
}

type User {
    _id: ID
    username: String
    email: String
    bookCount: Number
    savedBooks: [Book]

type Book {
    bookId: [bookId]
    authors: [String]
    title: String
    description: String
    image: String
    link: String

type Auth {
    token: ID!
    user: User
}
type Query {
    me: [User]
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput ): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;