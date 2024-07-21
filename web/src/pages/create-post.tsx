import React, { useEffect } from 'react';	
import Wrapper from '../components/Wrapper';
import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { Button as ShadButton } from '../components/ui/button';

import router from 'next/router';
import { InputField } from '../components/inputField';
import { toErrrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
const CreatePost: React.FC<{}> = ({}) => {
  
  const [, createPost] = useCreatePostMutation();
  const router = useRouter()
  useIsAuth()

    return (
        <Layout variant="small">
                  <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const {error} = await createPost({input: values});
          if(!error){
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <ShadButton className='p-2 mt-4	'>
            <Button
              type="submit"
              isLoading={isSubmitting}
              variant="teal"
            >
              Create Post
            </Button>
            </ShadButton>

   
          </Form>
        )}
      </Formik>
            
        </Layout>
    );
}
export default withUrqlClient(createUrqlClient)(CreatePost);