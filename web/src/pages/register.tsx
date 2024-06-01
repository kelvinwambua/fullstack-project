import React from "react";
interface registerProps {}
import { Form, Formik } from 'formik';
import Wrapper from "../components/Wrapper";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { InputField } from "../components/inputField";



     
    
const Register: React.FC<registerProps> = () => {
  return (
    <Wrapper variant="small">
    <Formik initialValues={{username: "",password:""}}
    onSubmit={(values)=> {
        console.log(values)
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