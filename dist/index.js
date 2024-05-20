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
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
require("reflect-metadata");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const app = (0, express_1.default)();
    let redisClient = (0, redis_1.createClient)({ url: "redis://127.0.0.1:6379" });
    redisClient.on("connect", () => console.log("Redis Client Connected"));
    redisClient.on("error", (err) => console.error("Redis Client Error:", err));
    yield redisClient.connect().catch((err) => {
        console.error("Failed to connect to Redis:", err);
        process.exit(1);
    });
    app.use((0, express_session_1.default)({
        name: "Tcy",
        store: new connect_redis_1.default({
            client: redisClient,
            prefix: "myapp:",
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "your_strong_secret_here",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
        cors: {
            origin: "https://studio.apollographql.com/sandbox/explorer",
            credentials: true,
        },
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
});
main().catch((err) => {
    console.error("Error starting server:", err);
});
//# sourceMappingURL=index.js.map