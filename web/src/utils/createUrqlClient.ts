import { url } from "inspector";
import {debugExchange, fetchExchange } from "urql";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, fetchExchange, cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, _args, cache, _info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache,{query: MeDocument},
           _result, () => null
        );

        },
        login: (_result, _args, cache, _info) => {
          
            betterUpdateQuery<LoginMutation, MeQuery>(cache,{query: MeDocument},
             _result, (result, query) => {
                if(result.login.errors){
                return query;
              }else {
                return {
                  me: result.login.user,
                };
                }
              }
          );
        },
        register: (_result, _args, cache, _info) => {
          
          betterUpdateQuery<RegisterMutation, MeQuery>(cache,{query: MeDocument},
           _result, (result, query) => {
              if(result.register.errors){
              return query;
            }else {
              return {
                me: result.register.user,
              };
              }
            }
        );
      }
      }
    }
  })],
  fetchOptions: {credentials: "include" as const},
});

  
