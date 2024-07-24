import { Provider, createClient, fetchExchange, debugExchange } from "urql";
import type { QueryInput, Cache } from '@urql/exchange-graphcache';
import { cacheExchange } from '@urql/exchange-graphcache';
import { MeDocument, LoginMutation , MeQuery, RegisterMutation } from "../generated/graphql";
export function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query | null) => Query | null){
  
    return cache.updateQuery(qi, data => fn(result, data as any) as any)
  }