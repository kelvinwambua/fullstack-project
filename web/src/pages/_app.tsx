import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, createClient, fetchExchange, debugExchange } from "urql";
import { QueryInput, cacheExchange, Cache } from "@urql/exchange-graphcache";
import { MeDocument, LoginMutation , MeQuery, RegisterMutation } from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query | null) => Query | null){

  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
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
  fetchOptions: {credentials: "include"},
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
