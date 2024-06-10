import { NextPage } from "next";
import React from "react";
import Wrapper from "../../components/Wrapper";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { toErrrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { InputField } from "../../components/inputField";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

interface ChangePasswordProps {
  token: string | null;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = React.useState("");

  return (
    <>
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            if (!token) {
              setTokenError("Invalid token");
              return;
            }

            const response = await changePassword({
              newPassword: values.newPassword,
              token,
            });

            if (response.data?.changePassword.errors) {
              const errorMap = toErrrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              } else {
                setErrors(errorMap);
              }
            } else if (response.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
              {tokenError ? 
              <Box>
                <Box color="red">
                  {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Box color="blue">click here to get a new one</Box>

                  </NextLink>
                </Box>: null}
              <Button mt={4} type="submit" isLoading={isSubmitting} variant="teal">
                change password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const token = context.query.token;

  return {
    props: {
      token: token || null,
    },
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);