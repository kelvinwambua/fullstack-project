import React from "react";
interface registerProps {}
import { Form, Formik } from 'formik';
import Wrapper from "../components/Wrapper";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { InputField } from "../components/inputField";
import { useMutation } from "urql";



const REGISTER_MUT = `mutation ($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
`
    
const Register: React.FC<registerProps> = () => {
  const[{},register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant="small">
    <Formik initialValues={{username: "",password:""}}
    onSubmit={ async (values)=> {
        console.log(values)
        const response = await register(values)
    }}>
        {({values, handleChange, isSubmitting})=>(<Form>
            <InputField name="username" placeholder="username" label="Username"/>
            <Box mt={4}><InputField name="password" placeholder="password" label="Password" type="password"/></Box>
            <Button isLoading={isSubmitting}mt={4} type="submit" colorScheme="teal">Register</Button>
      
        </Form>)}
    </Formik>
    </Wrapper>
    
  );
};

export default Register;