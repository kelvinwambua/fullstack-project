import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../components/ui/menubar"
import { Button as ShadButton } from "../components/ui/button"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const route = useRouter();
  const [{fetching:logoutFetching}, logout] = useLogoutMutation();
  const [{data, fetching}] = useMeQuery({
    pause: isServer(),
  });
   
  let body = null;
  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <Flex gap={2}>
        <NextLink href="/login">
          <ShadButton>Login</ShadButton>
        </NextLink>
        <NextLink href="/register">
          <ShadButton>Register</ShadButton>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex alignItems="center" gap={2}>
        <Box>{data.me.username}</Box>
        <ShadButton  variant="destructive"
          onClick={() => {logout({}); window.location.reload();}}
          disabled={logoutFetching}
        >
          Logout
        </ShadButton>
      </Flex>
    );
  }

  return (
    <Menubar
      className="flex justify-between items-center"
      style={{
        zIndex: 1,
        position: 'sticky',
        top: 0,
        padding: '1.5rem',
      }}
    >
      <MenubarMenu>
        <h1 className="font-semibold text-l">Chirper</h1>
      </MenubarMenu>
      <MenubarMenu>
        {body}
      </MenubarMenu>
    </Menubar>
  );
};