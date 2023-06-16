import React, { useState } from 'react'
import { useToast, VStack } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
//import { useToast } from '@chakra-ui/react'

const Signup = ()=> {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [profilePic, setProfilePic] = useState()
    const [loading,setLoading] = useState(false)
    const toast = useToast();
    const history = useNavigate();

    const postDetails = (profilePic)=>{
      setLoading(true);
      if(profilePic === undefined){
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        return;
      }

      if(profilePic.type === "image/jpeg" || profilePic.type === "image/png"){
        const data = new FormData();
        data.append("file", profilePic);
        data.append("upload_preset", "disCuter");
        data.append("cloud_name", "dfdplrpon");
        fetch("https://api.cloudinary.com/v1_1/dfdplrpon/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setProfilePic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
      else{
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false);
        return;
      }
    };

    const submitHandler = async()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword || (password !== confirmPassword)){
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

        const { data } = await axios.post("/api/user",{name,email,password,profilePic},config);
        toast({
          title: "User Successfully Registered",
          status: "success",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });

        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        history.push("/chats")
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
    <VStack spacingg = '5px'>
        <FormControl id = "first-name" isRequired color={"#000000"}>
            <FormLabel>Name</FormLabel>
            <Input placeholder = "Enter Your Name"
                onChange = {(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id = "email" isRequired color={"#000000"}>
            <FormLabel>Email</FormLabel>
            <Input placeholder = "Enter Your Email"
                onChange = {(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id = "password" isRequired color={"#000000"}>
            <FormLabel>Password</FormLabel>
            <Input type= {"password"} placeholder = "Enter Your Password"
                onChange = {(e)=>setPassword(e.target.value)}
            />
        </FormControl>
        <FormControl id = "confirmPassword" isRequired color={"#000000"}>
            <FormLabel>Confirm Password</FormLabel>
            <Input type= {"password"} placeholder = "Confirm Your Password"
                onChange = {(e)=>setConfirmPassword(e.target.value)}
            />
        </FormControl>
        <FormControl id="pic" color={"#000000"}>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        color = "#0056A1"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup;
