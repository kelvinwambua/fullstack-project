import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import  Wrapper  from "../components/Wrapper";
import { InputField } from "../components/inputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import {Button as ShadButton} from "../components/ui/button";
const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // worked
             if(typeof router.query.next === 'string'){
                router.push(router.query.next);}
            else{
              router.push("/");}
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <NextLink href="/forgot-password">
              <Box>forgot password?</Box>
            </NextLink>
            <ShadButton className="align-middle mt-4 p-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              variant="purple"
            >
              Login
            </Button>
            </ShadButton>
     
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);