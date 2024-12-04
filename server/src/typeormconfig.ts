


import {User} from "./entities/User";
import {Post} from "./entities/Post";
import path from "path";
import { DataSource } from "typeorm";
import { Vote } from "./entities/Vote";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "postgres2",
    synchronize: true,
    entities: [Post, User,Vote],
    logging: true,
        subscribers: [],
      migrations: [path.join(__dirname , "/migrations/*")],
  
  })
