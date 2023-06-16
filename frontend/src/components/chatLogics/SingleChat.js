import { ArrowBackIcon } from '@chakra-ui/icons';
import { AbsoluteCenter, Avatar, Box, Button, Center, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import ScrollableChat from '../ScrollableChat';
import { getPic, getSender } from './chatLogic';
import io from 'socket.io-client'
import UpdateGroupChat from './UpdateGroupChat';
import VideoConference from '../VideoCall/VideoConference';
import { useNavigate } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";

const ENDPOINT = "http://localhost:5000"
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [messages,setMessages] = useState([])
    const [newMessage,setNewMessage] = useState("")
    const [typing,setTyping] = useState(false)
    const [isTyping,setIsTyping] = useState(false)

    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    };

    const ChatState = () => {
            return useContext(ChatContext)
    }
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();

    const history = useNavigate();

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime
            
            if(timeDiff>=timerLength && typing){
                socket.emit("stop typing",selectedChat._id)
                setTyping(false);
            }
        }, timerLength);

    }

    const fethMessage = async(req,res) => {
        if(!selectedChat) return;

        try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setLoading(true)
                const {data} = await axios.get(`/api/message/${selectedChat._id}`,
                    config
                );
                
                setMessages(data);
                setLoading(false);

                socket.emit("join chat",selectedChat._id);
            } catch (err) {
                toast({
                    title: "Error Occurred!",
                    description:"Failed to Load the Message",
                    status: "error",
                    duration:5000,
                    isClosable:true,
                    position:'top'
                });
            }
    }


    const sendMessage = async(e) =>{
        if(e.key === 'Enter' && newMessage){
            socket.emit("stop typing",selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                
                setNewMessage("")
                const {data} = await axios.post("/api/message",{
                     content:newMessage,
                     chatID:selectedChat._id,
                },
                    config
                );

                //console.log(data);
                socket.emit("new message",data);
                setMessages([...messages,data]);
            } catch (err) {
                toast({
                    title: "Error Occurred!",
                    description:"Failed to send the Message",
                    status: "error",
                    duration:5000,
                    isClosable:true,
                    position:'top'
                });
            }
        }
    }

    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stop typing",()=>setIsTyping(false))
    },[])

    useEffect(() => {
        fethMessage();

        selectedChatCompare = selectedChat;
    }, [selectedChat])
    
    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare ||  selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain)
                }
            }
            else{
                setMessages([...messages,newMessageRecieved])
            }
        })
    })

    


    const MyMeeting = async(element) => {
        const appID = 1313340549
        const serverSecret = "c75ee402b8e179cc7038f89aaffeaf96"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,selectedChat._id,user._id,user.name);

        const zp =ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container:element,
            scenario:{
                mode:ZegoUIKitPrebuilt.VideoConference,
            }

        })
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleClose = () =>{
        onClose();
        history(0)
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontSize="29px"
                    pb = {3}
                    px = {2}
                    w = "100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{base:'space-between'}}
                    alignItems="center"
                >
                    <>
                        
                        <Avatar
                            mr={2}
                            size="md"
                            cursor="pointer"
                            name={getSender(user,selectedChat.users)}
                            src={!selectedChat.isGroupChat ? getPic(user,selectedChat.users):("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")}
                        />
                        <Text textColor="#b3b3b3">
                            {!selectedChat.isGroupChat ? getSender(user,selectedChat.users):(selectedChat.chatName.toUpperCase())}
                            {selectedChat.isGroupChat ? (
                                <UpdateGroupChat
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            ):(
                                <></>
                            )}
                        </Text>
                        <>
                            <Button display={{base:"none",md:"flex"}} onClick={onOpen}><i class="fas fa-video"></i></Button>

                            <Modal isOpen={isOpen} onClose={onClose}>
                                
                                <ModalContent>
                                <ModalBody w = "100%">
                                    <Center><div ref ={MyMeeting} style={{ left:"100", height: "0" }}/></Center>
                                </ModalBody>
                                    <AbsoluteCenter>
                                    <Button colorScheme='blue' mr={3} onClick={handleClose}>
                                        Close
                                    </Button>
                                    </AbsoluteCenter>
                                </ModalContent>
                            </Modal>
                        </>        
                        <Button
                            display={{base:"flex", md:"none"}}
                            onClick={()=>setSelectedChat("")}
                        
                        >
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        </Button>        
                    </>    
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                    bgColor= "#aaaaaa"
                >
                    {loading?(
                        <Spinner
                            size="xl"
                            alignSelf="center"
                            margin="auto"
                            h = {20}
                            w = {20} 
                        />    
                    ):(
                        <div style={{display:"flex" , flexDirection:"column" , overflowY:"scroll",scrollbarWidth:"none"}}>
                            <ScrollableChat messages = {messages} />
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt ={3} id="first-name">
                        {isTyping?<div>
                            <Lottie
                                options={defaultOptions}
                                // height={50}
                                width={60}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            />
                            </div>:(<></>)}
                        <Input 
                            variant = "filled"
                            bg = "#E0E0E0"
                            placeholder = "Enter a message...."
                            value = {newMessage}
                            onChange={handleTyping} 
                        />
                    </FormControl>
                </Box>
            </>    
            ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans" textColor="#ffffff">
                    Click on a user to start chatting
                    </Text>
                </Box>
        )}
    </>
  )
}

export default SingleChat
