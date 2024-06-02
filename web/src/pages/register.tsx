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
import {useMutation } from "../generated/graphql";


    
const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useMutation();
  return (
    <Wrapper variant="small">
    <Formik initialValues={{username: "",password:""}}
    onSubmit={ async (values,{setErrors})=> {
        console.log(values)
        const response = await register({options: values});
        console.log(response)
        if (response.data?.register.errors){
          setErrors(toErrrorMap(response.data.register.errors))
          console.log(response.data.register.errors)
        }else if (response.data?.register.user) {
          console.log("Pushing to home page");
          setTimeout(() => {
            router.push("/");
          }, 500); 
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

export default Register;