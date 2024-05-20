import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import  {Migrator} from '@mikro-orm/migrations';
import path from 'path';
import { User } from "./entities/User";
console.log(__dirname);
export default  {
    migrations:{
        migrator: Migrator,
        path: path.join(__dirname, './migrations'), 
        pattern: /^[\w-]+\d+\.(ts|js)$/,
    },
    entities:[Post, User],
    dbName: 'postgres',
    user: 'postgres',
    password: 'King_kelvin1',
    debug: !__prod__,
    driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
    extensions: [Migrator],
} as Parameters<typeof MikroORM.init>[0];

