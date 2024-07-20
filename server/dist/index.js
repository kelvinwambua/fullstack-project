"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const typeormconfig_1 = require("./typeormconfig");
Object.defineProperty(exports, "AppDataSource", { enumerable: true, get: function () { return typeormconfig_1.AppDataSource; } });
let redis = new ioredis_1.default({ host: "localhost", port: 6379 });
redis.on("connect", () => console.log("Redis Client Connected"));
redis.on("error", (err) => console.error("Redis Client Error:", err));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeormconfig_1.AppDataSource.initialize();
    typeormconfig_1.AppDataSource.runMigrations();
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use((0, cors_1.default)({
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        credentials: true,
    }), (0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new connect_redis_1.default({
            client: redis,
            prefix: "myapp:",
            disableTouch: true,
        }),
        cookie: {
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365 * 10)),
            maxAge: (1000 * 60 * 60 * 24 * 365 * 10),
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "KelvinisKelvin",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
});
main().catch((err) => {
    console.error("Error starting server:", err);
});
//# sourceMappingURL=index.js.map