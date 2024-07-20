import { ChakraProvider, Th } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { ThemeProvider } from "@emotion/react";
import "../styles/global.css";
import "../styles/output.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <ChakraProvider theme={theme}>
      
      <Component {...pageProps}/>

    </ChakraProvider>

  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(MyApp);
