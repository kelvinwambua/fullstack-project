import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import {cors} from "cors"; 

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const app = express();
  
  // Redis client configuration
  let redisClient = createClient({ url: "redis://127.0.0.1:6379" });
  redisClient.on("connect", () => console.log("Redis Client Connected"));
  redisClient.on("error", (err) => console.error("Redis Client Error:", err));
  await redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  });

  app.use(
    session({
      name: "Tcy",
      store: new RedisStore({
        client: redisClient,
        prefix: "myapp:",
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "your_strong_secret_here", // Replace with a secure secret
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
    cors: {
      origin: "https://studio.apollographql.com/sandbox/explorer", 
      credentials: true, 
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error("Error starting server:", err);
});
