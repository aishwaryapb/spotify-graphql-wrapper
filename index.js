const { ApolloServer } = require('apollo-server');
require('dotenv').config()

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

server.listen({ port: PORT }).then(res => console.log(`Server running at ${res.url}`))