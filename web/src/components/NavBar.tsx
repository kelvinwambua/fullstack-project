import React from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter} from "next/router";
interface NavBarProps {}

export const  NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [{data, fetching}] = useMeQuery();
    const[{fetching:logoutFetching},logout] = useLogoutMutation();
    
    let body = null;
    if(fetching){
        body = null;

    } else if (!data?.me){
        body = (
            <>
            <NextLink href="/login"> 
          <Link mr={4} fontWeight="bold" fontSize="xl">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4} fontWeight="bold" fontSize="xl">
            Register
          </Link>
        </NextLink>
        </>
        );

    } else {
      body = (
        <Flex>
          <Box mr={4}>{data.me.username}</Box>
          <Button isLoading={logoutFetching} onClick={() => {logout({}); router.push("/");}} variant="link">Logout</Button>
        </Flex>
      );

    }

  return (
    <Flex bg="tomato" p={4} justifyContent="space-between" alignItems="center"> 
    
 
      <Box>
        
          <Link mr={4} fontWeight="bold" fontSize="xl">
            Fullstack App
          </Link>
      </Box>

      <Box>
        {body}
      </Box>
    </Flex>
  );
};
