import { url } from "inspector";
import {debugExchange, fetchExchange, Exchange, stringifyVariables, Query } from "urql";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from "../generated/graphql";
import { Resolver, cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {pipe, tap} from "wonka";	
import  Router  from "next/router";
import { FieldsOnCorrectTypeRule } from "graphql";
import createPost from "../pages/create-post";
import gql from "graphql-tag";
import * as Urql from 'urql';

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

  
  const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
      const { parentKey: entityKey, fieldName } = info;
      const allFields = cache.inspectFields(entityKey);
      console.log("allFields: ", allFields);
      const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
      const size = fieldInfos.length;
      if (size === 0) {
        return undefined;
      }
  
      const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
      const isItInTheCache = cache.resolve(entityKey, fieldKey);
      info.partial = !isItInTheCache;
      const results: string[] = [];
      fieldInfos.forEach((fi) => {
        const data = cache.resolve(entityKey, fi.fieldKey) as string[];
        results.push(...data);
      });
  
      return results;
  
      // const visited = new Set();
      // let result: NullArray<string> = [];
      // let prevOffset: number | null = null;
  
      // for (let i = 0; i < size; i++) {
      //   const { fieldKey, arguments: args } = fieldInfos[i];
      //   if (args === null || !compareArgs(fieldArgs, args)) {
      //     continue;
      //   }
  
      //   const links = cache.resolveFieldByKey(entityKey, fieldKey) as string[];
      //   const currentOffset = args[cursorArgument];
  
      //   if (
      //     links === null ||
      //     links.length === 0 ||
      //     typeof currentOffset !== "number"
      //   ) {
      //     continue;
      //   }
  
      //   if (!prevOffset || currentOffset > prevOffset) {
      //     for (let j = 0; j < links.length; j++) {
      //       const link = links[j];
      //       if (visited.has(link)) continue;
      //       result.push(link);
      //       visited.add(link);
      //     }
      //   } else {
      //     const tempResult: NullArray<string> = [];
      //     for (let j = 0; j < links.length; j++) {
      //       const link = links[j];
      //       if (visited.has(link)) continue;
      //       tempResult.push(link);
      //       visited.add(link);
      //     }
      //     result = [...tempResult, ...result];
      //   }
  
      //   prevOffset = currentOffset;
      // }
  
      // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
      // if (hasCurrentPage) {
      //   return result;
      // } else if (!(info as any).store.schema) {
      //   return undefined;
      // } else {
      //   info.partial = true;
      //   return result;
      // }
    };
  };
export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, errorExchange, fetchExchange, ssrExchange, cacheExchange({
    resolvers: {
      Query: {
        posts: cursorPagination(),
      },
    },
    updates: {
      Mutation: {
        vote: (_result, args, cache, info) => {
          const { postId, value } = args as VoteMutationVariables;
          const data = cache.readFragment(
            gql`
              fragment _ on Post {
                id
                points
                voteStatus
              }
            `,
            { id: postId } as any
          );

          if (data) {
            if (data.voteStatus === value) {
              return;
            }
            const newPoints =
              (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
            cache.writeFragment(
              gql`
                fragment __ on Post {
                  points
                  voteStatus
                }
              `,
              { id: postId, points: newPoints, voteStatus: value } as any
            );
          }
        },

        createPost: (_result, _args, cache, _info) => {
          const allFields = cache.inspectFields("Query");
          const fieldInfos = allFields.filter((info)=> info.fieldName === "posts");
          fieldInfos.forEach((fi)=>{
            cache.invalidate("Query","posts" , fi.arguments || {})
          })
          cache.invalidate("Query", "posts", {
              limit:15
            });
            
        },
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

  