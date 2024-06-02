import React from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

export const  NavBar: React.FC<{}> = () => {
    const [{data, fetching}] = useMeQuery();
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
                <Button variant="link">Logout</Button>
            </Flex>
        );

    }

  return (
    <Flex bg="tomato" p={4} justifyContent="space-between" alignItems="center"> 
    
 
      <Box>
        <NextLink href="/"> {/* Link to your app's home or logo */}
          <Link mr={4} fontWeight="bold" fontSize="xl">
            Fullstack App
          </Link>
        </NextLink>
      </Box>

      <Box>
        {body}
      </Box>
    </Flex>
  );
};
