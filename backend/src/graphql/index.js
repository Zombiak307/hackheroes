const { ApolloServer,AuthenticationError, gql } = require('apollo-server-express');
// const {GuildResolvers,GuildTypeDefs} = require('./guilds/');
// const {ReportsTypeDefs,ReportResolvers} = require('./reports/')
// const {MiscResolvers, MiscTypeDefs} = require('./misc/')
const {permissionDirectiveTransformer} = require('./admin/')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { DummyResolvers, DummyTypeDefs } = require('./dummy');

const resolvers = {
    Query: {
      ...DummyResolvers.Query
    },
    Mutation:{
      ...DummyResolvers.Mutation
    }
}

let schema = makeExecutableSchema({
  typeDefs: [DummyTypeDefs],
  resolvers: resolvers
}) 

schema = permissionDirectiveTransformer(schema)

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5500/graphql"],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
};

module.exports ={
    async startApolloServer(app) {
        const server = new ApolloServer({ 
            schema,
            context:({req}) => {
              //if(!req.headers || !req.headers.origin || req.headers.origin !== process.env.FRONTEND_URL) throw new AuthenticationError("Invalid origin")
              //Jeśli znajdziemy kiedyś jeszcze lepszy sposob na sprawdzanie czy requesty wysłane zostały przez frontend to tutaj trzeba tego użyć
              return req
            },
            formatError: (err) => {
              return err
            },
            plugins: [
              ApolloServerPluginLandingPageGraphQLPlayground(), //Dev plugin, not usable anymore due to request validation
              {
                requestDidStart({context:ctx}){ //NOTE: This event is fired when any request(query, mutation etc) is started
                  return {
                  async didEncounterErrors({ errors }) { // This event is fired if request has encountered errors
                    if (errors.length > 0) {
                      errors.forEach(error => {
                        if(error.extensions.code === "FORBIDDEN" || error.extensions.code === "BAD_USER_INPUT") error.extensions.userId = ctx.user.discordId //This adds userId to extensions of error if it's forbidden error(we can track which user is trying to do something above his permissions)
                      })
                    }
                  }
                }
                }
              }
            ],
        })
          await server.start();

        server.applyMiddleware({ app, cors:corsOptions});
       
        console.log(`Apollo server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    }
}