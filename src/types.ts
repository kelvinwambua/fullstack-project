import { Request, Response } from "express";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: any}; 
  res: Response;
};
