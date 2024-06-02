import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { Client, Provider, createClient, fetchExchange, debugExchange} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { NavBar } from "../components/NavBar";
const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, fetchExchange, cacheExchange({})],
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
