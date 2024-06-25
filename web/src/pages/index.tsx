import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link, Stack, Box, Heading, Text, Flex, Button, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 33,
    cursor: null as null | string,
  });

  const [allPosts, setAllPosts] = useState<any[]>([]);

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  useEffect(() => {
    if (data && data.posts.posts) {
      setAllPosts((prevPosts) => [...prevPosts, ...data.posts.posts]);
    }
  }, [data]);

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {allPosts.map((p) => (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
            <Flex>    
              <ChevronUpIcon/>  
              {p.points}
              <ChevronDownIcon/>
              </Flex>
              <Box>            
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>Posted by {p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>

            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);