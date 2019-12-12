import 'babel-polyfill';

const Match = {
    contendants: async (parent, args, ctx, info) => {
        const contendants = parent.contendants;
        const {client} = ctx;
        const db = client.db("sports");
        const collection = db.collection("teams");

        const result = await collection.find({_id:{$in: contendants}}).toArray();

        return result;
    }
}

export {Match as default}