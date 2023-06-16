import React, { useContext, useState } from 'react'
import { Box, Button, Drawer, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../context/ChatProvider'
import {DrawerBody,DrawerFooter,DrawerHeader,DrawerOverlay,DrawerContent,DrawerCloseButton} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserList from './UserList'
import { BellIcon } from '@chakra-ui/icons'
import { getSender } from './chatLogics/chatLogic'
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";


const SideBar = () => {
    const history = useNavigate();

    const [search,setSearch] = useState();
    const [loading,setLoading] = useState(false)
    const [loadingChat,setLoadingChat] = useState(false)
    const[searchResults,setSearchResults] = useState([])
    const toast = useToast();

    const handleSearch =  async () => {
        if(!search){
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration:5000,
                isClosable:true,
                position:'top'
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`/api/user?search=${search}`,config);

            setLoading(false);
            setSearchResults(data);
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description:"Failed to Load Search Result",
                status: "error",
                duration:5000,
                isClosable:true,
                position:'top'
            });
        }
        
    }

    const ChatState = () => {
            return useContext(ChatContext)
    }

    const {user,setSelectedChat,chat,setChat,notification,setNotification} = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        history("/")
    }

    const accessChat = async(userID) => {
        setLoadingChat(true)
        history(0);
        try {
            setLoading(true);

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post('/api/chat',{userID},config)
            if(!chat.find((c)=> c._id === data._id)) setChat([data],...chat);

            setSelectedChat(data)
            setLoadingChat(false)
            onClose();
            
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description:"Failed to Load Chat Details",
                status: "error",
                duration:5000,
                isClosable:true,
                position:'top'
            });
        }
        
    }

  return (
    <>
        <Box
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            bg='#012A4A' 
            w="100%"
            p="5px 15px 5px 10px"
            borderWidth="5px"
        >
            <Tooltip hasArrow label="Search User">
                <Button variant="ghost" onClick={onOpen} bgColor="#F6F1F1">
                    <i class = "fas fa-search"/>
                    <Text display={{base:"none",md:"flex"}} px ="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily=" Libre Baskerville " justifyContent="center" color="#F6F1F1"> 
                    CHAMBER OF SECRETS
            </Text>
            <div>
                <Menu bgColor="#F6F1F1" pl={5}>
                <MenuButton p={1} >
                <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                />
                <div style={{color:"#F6F1F1"}}>
                <i class="fa-solid fa-bell" ></i>
                </div>
                </MenuButton>
                    <MenuList pl={2}>
                    {!notification.length && "No New Messages"}
                    {notification.map((notif) => (
                        <MenuItem
                        key={notif._id}
                        onClick={() => {
                            setSelectedChat(notif.chat);
                            setNotification(notification.filter((n) => n !== notif));
                        }}
                        >
                        {notif.chat.isGroupChat
                            ? `New Message in ${notif.chat.chatName}`
                            : `New Message from ${getSender(user, notif.chat.users)}`}
                        </MenuItem>
                    ))}
                    </MenuList>
                </Menu>
                <Button variant = "ghost" onClick={logoutHandler} bgColor="#ffffff">
                    Logout
                </Button>
            </div>
        </Box>

        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent bgColor="White">
                <DrawerHeader borderBottomWidth="1px" textColor="#ffffff">Search User</DrawerHeader>
                <DrawerBody>
                    <Box display="flex" pb={2}>
                    <Input
                        color="#202020"
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                    </Box>

                
                {loading ? (
                    <ChatLoading />
                ):(
                    searchResults?.map((user)=>(
                        <UserList 
                            key = {user._id}
                            user = {user}
                            handleFunction= {()=>accessChat(user._id)}
                        />
                    ))
                )}
                {loadingChat && (<Spinner ml ="auto" display="flex" />)}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
  )
}

export default SideBar
