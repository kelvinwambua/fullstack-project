import {  Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

import router from 'next/router';
import React, { useState } from 'react';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/inputField';
import { toErrrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = () => {
    const [complete, setComplete] = useState(false);
    const [, ForgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { setErrors }) => {
            await ForgotPassword(values);
            setComplete(true)

          }}
        >
          {({ isSubmitting }) => complete ? (
          <Box>
            if an account with that email exists, we sent you an email

          </Box>): (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
              />


              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variant="teal"
              >
                Reset Password 
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);