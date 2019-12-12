import {GraphQLServer, PubSub} from 'graphql-yoga'
import {MongoClient, ObjectID} from 'mongodb';
import * as uuid from 'uuid';
import 'babel-polyfill';
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import Team from "./resolvers/Team.js";
import Match from "./resolvers/Match.js";
import Subscription from "./resolvers/Subscription.js"




//Data
const usr = "aferrarib";
const pwd = "password123456";
const url = "js-database-tlh0d.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  
  const resolvers = {
    Query,
    Mutation,
    Team,
    Match,
    Subscription,
  };


  const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context });
  const options = {
    port: 2000
  };

  try {
    server.start(options, ({ port }) =>
        console.log(`Server listening my friend on port ${port}`)
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  let a;
  const pubsub = new PubSub();
  try {
    runGraphQLServer({ client ,db: client.db("sports"), pubsub, a});
  } catch (e) {
    console.log(e)
    client.close();
  }
};

runApp();