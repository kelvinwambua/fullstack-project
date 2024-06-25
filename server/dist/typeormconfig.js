"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "King_kelvin1",
    database: "postgres2",
    synchronize: true,
    entities: [Post_1.Post, User_1.User],
    logging: true,
    subscribers: [],
    migrations: [path_1.default.join(__dirname, "/migrations/*")],
});
//# sourceMappingURL=typeormconfig.js.map