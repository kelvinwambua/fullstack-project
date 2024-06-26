import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { IconButton, Flex } from '@chakra-ui/react';

interface VoteSectionProps {
    post: PostSnippetFragment
}

export const VoteSection: React.FC<VoteSectionProps> = ({post}) => {
    const [,vote] = useVoteMutation()
    const [loadingState, setLoadingState] = useState<'upvote-loading'| 'downvote-loading'| 'not-loading'>('not-loading');
    const [pointsState, setPointsState] = useState(post.points);
    const [voteStatus, setVoteStatus] = useState(post.voteStatus);

    const updateVote = async (value: number) => {
        if (voteStatus === value) {
            return; // If already voted this way, do nothing
        }
        
        setLoadingState(value === 1 ? 'upvote-loading' : 'downvote-loading');
        
        // Optimistically update UI
        setVoteStatus(value);
        setPointsState(prevPoints => prevPoints + value - (post.voteStatus || 0));

        try {
            const response = await vote({
                postId: post.id,
                value: value,
            });
            if (!response.data?.vote) {
                // If vote failed, revert changes
                setVoteStatus(post.voteStatus);
                setPointsState(post.points);
            }
        } catch (error) {
            console.error("Voting error:", error);
            // Revert changes on error
            setVoteStatus(post.voteStatus);
            setPointsState(post.points);
        }
        setLoadingState('not-loading');
    };

    return (
        <Flex direction="column" justifyContent="center" alignItems="center" mr={4} >    
            <IconButton 
                isRound={false} 
                variant='solid' 
                colorScheme={voteStatus === 1 ? "green" : "gray"}
                aria-label='Upvote'
                fontSize='lg' 
                onClick={() => updateVote(1)}
                isLoading={loadingState === 'upvote-loading'}
                icon={<ChevronUpIcon />}
            />
            {pointsState}
            <IconButton 
                isRound={false} 
                variant='outline' 
                colorScheme={voteStatus === -1 ? "red" : "gray"} 
                aria-label='Downvote'
                fontSize='lg' 
                onClick={() => updateVote(-1)}
                isLoading={loadingState === 'downvote-loading'}
                icon={<ChevronDownIcon />}
            />
        </Flex>
    );
}