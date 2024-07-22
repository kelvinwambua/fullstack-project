import { ChakraProvider as ChakraUIProvider, ColorModeScript } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraUIProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraUIProvider>
  )
}