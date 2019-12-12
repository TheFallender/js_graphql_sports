import 'babel-polyfill';

const Query = {
    listTeams: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const db = client.db("sports");
        const match_collection = db.collection("teams");

        const result = await match_collection.find().toArray();

        return result;
    },
}

export {Query as default}