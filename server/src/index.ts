import "reflect-metadata";
import {DataSource} from 'typeorm'
import { COOKIE_NAME, __prod__ } from "./constants";

import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors"; // Import the cors package
import Redis from "ioredis";
import { User } from './entities/User';
import { Post } from './entities/Post';

let redis = new Redis({ host: "localhost", port: 6379});
redis.on("connect", () => console.log("Redis Client Connected"));
redis.on("error", (err) => console.error("Redis Client Error:", err));

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "King_kelvin1",
  database: "postgres2",
  synchronize: true,
  entities: [Post, User],
  logging: true,
      subscribers: [],
    migrations: [],

})




const main = async () => {
   await AppDataSource.initialize();

  
 
  

 

  


  
  const app = express();
  app.set('trust proxy', 1);




  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    }),
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        prefix: "myapp:",
        disableTouch: true,
      }),
      cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365 * 10)),
        maxAge: (1000 * 60 * 60 * 24 * 365 * 10),
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "KelvinisKelvin", // Replace with a secure secret
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({  req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({app, cors: false});

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};
export {AppDataSource};

main().catch((err) => {
  console.error("Error starting server:", err);
});
