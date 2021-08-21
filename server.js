require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema";
import { getUser, protectedResolver } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import pubsub from "./pubsub";
import { log } from "console";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.authorization),
        protectedResolver,
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ Authorization }) => {
      if (!Authorization) {
        throw new Error("You can't listen.");
      }

      const loggedInUser = await getUser(Authorization);
      return {
        loggedInUser,
      };
    },
  },
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚗 Server is running on http://localhost:${PORT}/`);
});
