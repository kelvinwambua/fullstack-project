import { Request, Response } from "express";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import session from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: session.Session & Partial<session.SessionData> & { userId?: number }}; 
  res: Response;
  redis: Redis;
};
