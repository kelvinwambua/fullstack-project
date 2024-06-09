import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link, Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  textSnippet: string;
  createdAt: string;
  updatedAt: string;
}

const Index = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  useEffect(() => {
    if (data?.posts) {
      setAllPosts((prevPosts) => [...prevPosts, ...data.posts]);
    }
  }, [data]);

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>
      <br />
      {allPosts.length > 0 ? (
        <Stack spacing={8}>
          {allPosts.map((p) =>
            p ? (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ) : null
          )}
        </Stack>
      ) : fetching ? (
        <div>loading...</div>
      ) : (
        <div>you got query failed for some reason</div>
      )}
      {allPosts.length > 0 && data?.posts && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts[data.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);