import { ChakraProvider, ThemeProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider  theme={theme}>
    <ChakraProvider theme={theme}>
      
      <Component {...pageProps}/>

    </ChakraProvider>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(MyApp);
