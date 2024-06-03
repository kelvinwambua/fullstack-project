import React from "react";
import { Form, Formik } from "formik";
import Wrapper from "../components/Wrapper";
import { Box, Button, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { InputField } from "../components/inputField"; // Assuming you have this component
import { toErrrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { useRegisterMutation } from "../generated/graphql";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await register({ options: values });
          console.log(response);
          if (response.data?.register.errors) {
            setErrors(toErrrorMap(response.data.register.errors));
            console.log(response.data.register.errors);
          } else if (response.data?.register.user) {
            console.log("Pushing to home page");
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="username" label="Username" />
        
              <InputField name="email" placeholder="email" label="Email" />
            
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button isLoading={isSubmitting} mt={4} type="submit" colorScheme="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
