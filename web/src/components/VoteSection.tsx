import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { IconButton, Flex } from '@chakra-ui/react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteSectionProps {
  post: PostSnippetFragment;
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (value: number) => {
    if (post.voteStatus === value) return;
    setIsLoading(true);

    try {
      // Optimistic UI Update (assuming points cannot be null)
      post.points = (post.points ?? 0) + (post.voteStatus ? 2 : 1) * value;
      post.voteStatus = value; 

      await vote({ postId: post.id, value });
    } catch (error) {
      console.error('Vote failed:', error);
      // Handle errors (e.g., show a toast message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        isLoading={isLoading}
        variant={post.voteStatus === 1 ? 'solid' : 'outline'}
        colorScheme={post.voteStatus === 1 ? 'green' : 'gray'}
        aria-label="Upvote"
        onClick={() => handleVote(1)}
        icon={<ChevronUpIcon />}
      />
      {post.points} 
      <IconButton
        isLoading={isLoading}
        variant={post.voteStatus === -1 ? 'solid' : 'outline'}
        colorScheme={post.voteStatus === -1 ? 'red' : 'gray'}
        aria-label="Downvote"
        onClick={() => handleVote(-1)}
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
