const { ApolloServer } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const resolvers = require("../resolvers");
const typeDefs = require("../typeDefs");

const createTestServer = (ctx) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    mockEntireSchema: false,
    mocks: true,
    context: () => ctx,
  });

  return createTestClient(server);
};

module.exports = {
  createTestServer,
};
