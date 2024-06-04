import React from 'react';	
import Wrapper from '../components/Wrapper';
import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

import router from 'next/router';
import { InputField } from '../components/inputField';
import { toErrrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';

const CreatePost: React.FC<{}> = ({}) => {
    return (
        <Wrapper variant="small">
                  <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log(values);
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

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variant="teal"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
            
        </Wrapper>
    );
}
export default CreatePost;