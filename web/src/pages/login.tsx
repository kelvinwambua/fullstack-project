import React from "react";
interface registerProps {}
import { Form, Formik } from 'formik';
import Wrapper from "../components/Wrapper";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { InputField } from "../components/inputField";
import { toErrrorMap } from "../toErrorMap";
import { useRouter } from "next/router";
import { error } from "console";
import { Options } from "csv-parser";
import {useLoginMutation } from "../generated/graphql";


    
const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
    <Formik initialValues={{username: "",password:""}}
    onSubmit={ async (values,{setErrors})=> {
        console.log(values)
        const response = await login({options: values});
        console.log(response)
        if (response.data?.login.errors){
          setErrors(toErrrorMap(response.data.login.errors))
          console.log(response.data.login.errors)
        }else if (response.data?.login.user) {
          console.log("Pushing to home page");
            router.push("/");
        }
          
        
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

export default Login;