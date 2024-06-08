import { url } from "inspector";
import {debugExchange, fetchExchange, Exchange } from "urql";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {pipe, tap} from "wonka";	
import  Router  from "next/router";

export const errorExchange: Exchange = ({forward}) => (ops$) => {
  return pipe (
    forward(ops$),
    tap(({error}) => {
      if(error) {
        if(error?.message.includes("not authenticated")){
        Router.replace("/login");
          
      }
    }
    })
  )};
export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, errorExchange, fetchExchange, ssrExchange, cacheExchange({
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

  
