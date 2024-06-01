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
import cors from "cors"; // Import the cors package


const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const app = express();
  app.set('trust proxy', 1);

  let redisClient = createClient({ url: "redis://127.0.0.1:6379" });
  redisClient.on("connect", () => console.log("Redis Client Connected"));
  redisClient.on("error", (err) => console.error("Redis Client Error:", err));
  await redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  });

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    }),
    session({
      name: "mtume",
      store: new RedisStore({
        client: redisClient,
        prefix: "myapp:",
        disableTouch: true,
      }),
      cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365 * 10)),
        maxAge: (1000 * 60 * 60 * 24 * 365 * 10),
        httpOnly: true,
        sameSite: "none",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "KelvinisKelvin", // Replace with a secure secret
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({app, cors: false});

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error("Error starting server:", err);
});
