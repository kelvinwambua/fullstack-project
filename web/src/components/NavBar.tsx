import React from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";
interface NavBarProps {}


export const  NavBar: React.FC<NavBarProps> = ({}) => {
    const route = useRouter();
    const[{fetching:logoutFetching},logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
      pause: isServer(),
    });
   
    
    let body = null;
    if(fetching){
        body = null;

    } else if (!data?.me){
        body = (
            <>
          <NextLink href="/login"> 
          <Link mr={4} fontWeight="bold" fontSize="xl" color={"white"}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4} fontWeight="bold" fontSize="xl" color={"white"}>
            Register
          </Link>
        </NextLink>
        </>
        );

    } else {
      body = (
        <Flex>
          <Box mr={4} color={"white"}>{data.me.username}</Box>
          <Button isLoading={logoutFetching} onClick={() => {logout({}); window.location.reload();}} color={"white"} variant="link">Logout</Button>
        </Flex>
      );

    }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="mainPurple" p={4} justifyContent="space-between" alignItems="center"> 
    
 
      <Box>
        
          <Link mr={4} fontWeight="bold" fontSize="xl" color={"white"}>
            Chirper
          </Link>
      </Box>

      <Box>
        {body}
      </Box>
    </Flex>
  );
};