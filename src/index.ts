import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up(); 
  const app = express();
  const redisClient = createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err)); 
  await redisClient.connect();

  const RedisStore = connectRedis(session);
  const sessionMiddleware = session({
    name: "qid",
    store: new RedisStore({ 
      client: redisClient, 
      prefix: "myapp:",
      disableTouch: true,
      legacyMode: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, 
      httpOnly: true,           
      sameSite: "lax",          
      secure: __prod__,         
    },
    saveUninitialized: false,   
    secret: "KelvinIsKelvin", 
    resave: false,            
  });
  app.use(sessionMiddleware);


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({em: orm.em.fork(), req, res}), 
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
