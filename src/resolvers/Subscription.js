const Subscription = {
    subscribeMatch: {
        subscribe(parent, args, ctx, info) {
            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);
        }
    },
    subscribeTeam: {
        subscribe(parent, args, ctx, info) {
            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);
        }
    },

};

export {Subscription as default}