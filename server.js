require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema";
import { getUser, protectedResolver } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import pubsub from "./pubsub";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.authorization),
        protectedResolver,
      };
    }
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
