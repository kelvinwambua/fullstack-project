import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link, Stack, Box, Heading, Text, Flex, Icon, IconButton, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { VoteSection } from "../components/VoteSection";
import { Button as ShadcnButton } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

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
         <ShadcnButton>Create Post</ShadcnButton>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <div className="space-y-8">
          {allPosts.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>
                  <Badge variant="outline">{p.creator.username}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <VoteSection post={p}/>
                  <div className="ml-4">
                    <p className="text-base">{p.textSnippet}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {timeAgo(new Date(parseInt(p.createdAt)))}
              </CardFooter>
            </Card>
          ))}
        </div>
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
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}




export default withUrqlClient(createUrqlClient, { ssr: true })(Index);