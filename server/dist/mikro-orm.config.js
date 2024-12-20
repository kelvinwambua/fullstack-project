"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const migrations_1 = require("@mikro-orm/migrations");
const path_1 = __importDefault(require("path"));
console.log(__dirname);
exports.default = {
    migrations: {
        migrator: migrations_1.Migrator,
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.(ts|js)$/,
    },
    entities: [Post_1.Post, User_1.User],
    dbName: 'postgres',
    user: 'postgres',
    password: 'King_kelvin1',
    debug: !constants_1.__prod__,
    driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
    extensions: [migrations_1.Migrator],
};
//# sourceMappingURL=mikro-orm.config.js.map