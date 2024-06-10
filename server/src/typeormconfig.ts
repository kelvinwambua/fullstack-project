


import {User} from "./entities/User";
import {Post} from "./entities/Post";
import path from "path";
import { DataSource } from "typeorm";







export const AppDataSource = new DataSource({
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
      migrations: [path.join(__dirname , "/migrations/*")],
  
  })