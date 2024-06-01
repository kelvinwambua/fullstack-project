import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { Client, Provider, createClient, fetchExchange, debugExchange } from "urql";
const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, fetchExchange],
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
