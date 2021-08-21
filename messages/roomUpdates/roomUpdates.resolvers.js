import { withFilter } from "apollo-server-express";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const foundRoom = await client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });

        if (!foundRoom) {
          throw new Error("You shall not see this.");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            if (roomUpdates.roomId === id) {
              const foundRoom = await client.room.findFirst({
                where: {
                  id,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });

              if (!foundRoom) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};
