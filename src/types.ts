import {Request, Response, Express} from 'express';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Express.Session };
  res: Response;
};
