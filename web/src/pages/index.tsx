import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link, Stack, Box, Heading, Text, Flex, Icon, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { VoteSection } from "../components/VoteSection";
import { Button as ShadcnButton } from "../components/ui/button";

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
      <ShadcnButton variant="ghost">Button</ShadcnButton>


        <NextLink href="/create-post">
          <Link ml="auto">
          Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {allPosts.map((p) => (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <VoteSection post={p}/>

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
          <ShadcnButton
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
          </ShadcnButton>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);