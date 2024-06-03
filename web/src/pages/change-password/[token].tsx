import { NextPage } from "next";
import React from "react";
import Wrapper from "../../components/Wrapper";
import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { Box } from "framer-motion";
import router from "next/router";
import { InputField } from "../../components/inputField";
import { toErrrorMap } from "../../utils/toErrorMap";
import login from "../login";
import { useChangePasswordMutation } from "../../generated/graphql";


interface ChangePasswordProps {
    token: string;
}

const ChangePassword: NextPage<{token: string}> = ({ token }) => {
    const[,changePassword] = useChangePasswordMutation();
    return (  <>
          <Wrapper variant="small">
    <Formik
      initialValues={{newPassword: "" }}
      onSubmit={async (values, { setErrors }) => {
    //     const response = await login(values);
    //     if (response.data?.login.errors) {
    //       setErrors(toErrrorMap(response.data.login.errors));
    //     } else if (response.data?.login.user) {
    //       // worked
    //       router.push("/");
    //     }
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

          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            variant="teal"
          >
            change password
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  </>)


ChangePassword.getInitialProps = ({ query }) => {
    return { token: query.token as string };
};
}
export default ChangePassword;