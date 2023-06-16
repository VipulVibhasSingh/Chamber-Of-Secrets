import React, { useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const Login = ()=> {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const toast = useToast();
    const history = useNavigate();
    const [loading,setLoading] = useState(false)

    const submitHandler = async() => {
      setLoading(true);
      if(!email || !password){
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false)
        return;
      }

      try {
        const config = {
          headers:{
            "Content-Type":"application/json",
          },
        };

        const { data } = await axios.post("/api/user/login",{email,password},config);
        toast({
          title: "Login Successful",
          status: "success",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history("/chats")
      } catch (error) {
        toast({
          title: "Error Occured!",
          description:error.response.data.message,
          status: "error",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false)
      }
    };

  return (
    <VStack spacing = '5px'>
        <FormControl id = "email" isRequired color={"#000000"}>
            <FormLabel>Email</FormLabel>
            <Input placeholder = "Enter Your Email"
                onChange = {(e)=>setEmail(e.target.value) }
            />
        </FormControl>
        <FormControl id = "password" isRequired color={"#000000"}>
            <FormLabel >Password</FormLabel>
            <Input type= {"password"}  placeholder = "Enter Your Password"
                onChange = {(e)=>setPassword(e.target.value)}
            />
        </FormControl>
      <Button
        
        color = "#0056A1"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Login
      </Button>
    </VStack>
  )
}

export default Login
