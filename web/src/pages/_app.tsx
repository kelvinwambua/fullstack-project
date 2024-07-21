import { ChakraProvider, DarkMode, Th } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

import "../styles/global.css";
import "../styles/output.css";
import { ThemeProvider } from "../components/themeprovider";

function MyApp({ Component, pageProps }: AppProps) {
  return (

    
    <ChakraProvider theme={theme}>
      
      <Component {...pageProps}/>

    </ChakraProvider>

  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(MyApp);
