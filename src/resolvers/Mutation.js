import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';
import { PubSub } from 'graphql-yoga';


const Mutation = {
    addTeam: async (parent, args, ctx, info) => {
        const {name} = args;

        const {client} = ctx;
        const db = client.db("sports");
        const team_collection = db.collection("teams");

        const team_exists = await team_collection.findOne({name});
        if (team_exists)
            throw new Error ("A team with that name already exists.");

        const result = await team_collection.insertOne({name});

        return {
            name,
        };
    },

    addMatch: async (parent, args, ctx, info) => {
        const {contendants, date} = args;

        const {client} = ctx;
        const db = client.db("sports");
        const team_collection = db.collection("teams");
        const match_collection = db.collection("matches");

        const progress = [contendants.length];
        const state = 0;

        const team_exists = await team_collection.find({_id: {$in: contendants}});
        
        if (!team_exists)
          throw new Error ("Couldn't find a team with that ID.");


        contendants.forEach((element, index) => {
            progress[index] = 0;
        });

        const teams = contendants.map(element => {
            return ObjectID(element);
        })


        const result = await match_collection.insertOne({contendants: teams, date, progress, state});

        if (!result.ops[0])
          throw new Error ("Couldn't create the bill");
        
        return result.ops[0];
    },

    updateMatchProgress: async (parent, args, ctx, info) => {
        const {id, progress} = args;

        const {client, pubsub} = ctx;
        const db = client.db("sports");
        const match_collection = db.collection("matches");

        const match_exists = await match_collection.findOne({_id: ObjectID(id)});

        if (!match_exists)
            throw new Error ("Couldn't find a match with that ID.");

        const result = await match_collection.findOneAndUpdate({_id: ObjectID(id)}, {$set:{progress}}, {returnOriginal: false});

        result.value.contendants.forEach(element => {
            pubsub.publish(
                element,
                {
                    subscribeTeam: result.value
                }
            );
        });

        pubsub.publish(
            id,
            {
                subscribeMatch: result.value
            }
        );


        return result.value;
    },

    updateMatchState: async (parent, args, ctx, info) => {
        const {id, state} = args;

        const {client, pubsub} = ctx;
        const db = client.db("sports");
        const match_collection = db.collection("matches");

        const match_exists = await match_collection.findOne({_id: ObjectID(id)});

        if (!match_exists)
            throw new Error ("Couldn't find a match with that ID.");

        const result = await match_collection.findOneAndUpdate({_id: ObjectID(id)}, {$set:{state}}, {returnOriginal: false});

        result.value.contendants.forEach(element => {
            pubsub.publish(
                element,
                {
                    subscribeTeam: result.value
                }
            );
        });

        pubsub.publish(
            id,
            {
                subscribeMatch: result.value
            }
        );

        return result.value;
    },
}

export {Mutation as default}