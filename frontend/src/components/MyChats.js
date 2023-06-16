import { AddIcon, SmallAddIcon } from '@chakra-ui/icons'
import { Box, Center, Stack, useToast,Text, Avatar, Button, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import ChatLoading from './ChatLoading'
import {getPic, getSender} from './chatLogics/chatLogic.js'
import GroupChatModal from './GroupChatModal'

const MyChats = ({ fetchAgain }) => {
  const [loggedinUser, setLoggedinUser] = useState()
  const ChatState = () => {
            return useContext(ChatContext)
    }

    const {user,setSelectedChat,chat,setChat,selectedChat} = ChatState();

    const toast = useToast();

    const fetchChats = async() => {
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

            const {data} = await axios.get(`/api/chat`,config);

            setChat(data)
            console.log(data);
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description:"Failed to Load ChatData",
                status: "error",
                duration:5000,
                isClosable:true,
                position:'top'
            });
        }
      }

      useEffect(() => {
          setLoggedinUser(JSON.parse(localStorage.getItem("userInfo")));
          fetchChats();
      }, [fetchAgain]);
      
  return (
      <Box
        display={{base: selectedChat ? "none" : "flex" , md:"flex"}}
        flexDir="column"
        w={{ base: "100%", md: "30%" }}
        bg="#1A3246"
        borderRadius="5px"
        boxShadow="dark-lg"
        p = "2"
        marginRight="10px"
      >
        <Box
          display="flex"
          w="100%"
          fontFamily="Work sans"  
          fontWeight="bold"
          fontSize="3xl"
          alignItems="center"
          justifyContent="space-between"
          textColor="#7aa4ca"
        >
          <Center>MyChats</Center>
          <GroupChatModal>
            <Button
              display="flex"  
              color="#121212"
              fontSize={{base:"17px",md:"10px",lg:"17px"}}
              >
                <i class="fa-solid fa-plus"></i>
              </Button>  
          </GroupChatModal> 
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          p={3}
          w="100%"
          h = "92%"
          bg="#1a3246"
          borderRadius="lg"
          overflowY="hidden"
        >
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab  textColor="white">Channels</Tab>
              <Tab  textColor="white">Direct Message</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {chat ?(
                  <Stack overflow="scroll">
                  {chat.map((singleChat)=>(
                    (  singleChat.isGroupChat ?(
                      <Box
                      onClick={()=>setSelectedChat(singleChat)}
                      cursor = "pointer"
                      bg={selectedChat===singleChat ? "#386385" : "#E8E8E8"}
                      color = {selectedChat === singleChat ? "white" : "black"}
                      px = {3}
                      py = {2}
                      borderRadius="lg"
                      key = {singleChat._id}
                      display="flex"
                    >
                      <Avatar
                        mr={2}
                        size="sm"
                        cursor="pointer"
                        name={getSender(user,singleChat.users)}
                        src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                      />
                      <Text>
                        {(singleChat.chatName)}
                      </Text>
                      
                    </Box>
                    ):(
                      <></>
                    ))
                  ))}
                  </Stack>
                ):(
                  <ChatLoading />
                )}
              </TabPanel>
              <TabPanel >
                {chat ?(
                  <Stack overflow="scroll">
                  {chat.map((singleChat)=>(
                    (  !singleChat.isGroupChat ?(
                      <Box
                      onClick={()=>setSelectedChat(singleChat)}
                      cursor = "pointer"
                      bg={selectedChat===singleChat ? "#38B2AC" : "#E8E8E8"}
                      color = {selectedChat === singleChat ? "white" : "black"}
                      px = {3}
                      py = {2}
                      borderRadius="lg"
                      key = {singleChat._id}
                      display="flex"
                    >
                      <Avatar
                        mr={2}
                        size="sm"
                        cursor="pointer"
                        name={getSender(user,singleChat.users)}
                        src={getPic(user,singleChat.users)}
                      />
                      <Text>
                        {getSender(user,singleChat.users)}
                      </Text>
                      
                    </Box>
                    ):(
                      <></>
                    ))
                  ))}
                  </Stack>
                ):(
                  <ChatLoading />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          {/* {chat ?(
            <Stack overflow="scroll">
              {chat.map((singleChat)=>(
                <Box
                  onClick={()=>setSelectedChat(singleChat)}
                  cursor = "pointer"
                  bg={selectedChat===singleChat ? "#38B2AC" : "#E8E8E8"}
                  color = {selectedChat === singleChat ? "white" : "black"}
                  px = {3}
                  py = {2}
                  borderRadius="lg"
                  key = {singleChat._id}
                  display="flex"
                >
                  <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={getSender(user,singleChat.users)}
                    src={!singleChat.isGroupChat ? getPic(user,singleChat.users):("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")}
                  />
                  <Text>
                    {!singleChat.isGroupChat ? getSender(user,singleChat.users):(singleChat.chatName)}
                  </Text>
                  
                </Box>
              ))}
            </Stack>
          ):(
            <ChatLoading />
          )} */}
        </Box>
      </Box>
  )
}

export default MyChats
