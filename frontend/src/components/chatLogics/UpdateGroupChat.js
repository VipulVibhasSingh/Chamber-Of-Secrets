import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, Input, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider'
import UserBadgeItem from '../UserBadgeItem';
import UserList from '../UserList';
import UserListDelete from '../UserListDelete';

const UpdateGroupChat = ({fetchAgain,setFetchAgain}) => {


    const [channelName,setChannelName] = useState();
    const [selectedUsers,setSelectedUsers] = useState([]);
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [searchResults,setSearchResults] = useState([]);
    const [renameLoading,setRenamaeLoading] = useState(false)

    const toast = useToast();

    const ChatState = () => {
            return useContext(ChatContext)
    }
    const {user,selectedChat,setSelectedChat} = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleRemove = async(usertoRemove) => {
        if(selectedChat.groupAdmin._id !== user._id &&  usertoRemove._id !== user._id){
            toast({ 
                title:"Only Moderator can remove someone!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        try{
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,{
                    chatId:selectedChat._id,
                    userId:usertoRemove._id
                },
                config
            );
          
            usertoRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                    });
                    setLoading(false)
                }
    }
    
    const handleRename = async () => {
      if (!channelName) {
        toast({
          title: "Please Enter New Channel Name",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        setRenamaeLoading(true)

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/rename`,
          {
            chatId:selectedChat._id,
            chatName:channelName
          },
          config
        );
          
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenamaeLoading(false);
        toast({
          title: "Channel Name Changed!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Update Channel Name!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenamaeLoading(false)
      }
      setChannelName("")
    };

    const handleSearch =  async (event) => {
        setSearch(event)
        if(!search){
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

    const handleAddUser = async(usertoAdd) => {
        if(selectedChat.users.find((u)=>u._id === usertoAdd._id)){
            toast({
                title:"User Already in Channel",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title:"Only Moderator can add someone!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        try{
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,{
                    chatId:selectedChat._id,
                    userId:usertoAdd._id
                },
                config
            );
          
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            toast({
                title: "User Added!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
                toast({
                    title: "Failed to Add user!",
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                    });
                    setLoading(false)
                }
    }

  return (
    <>
    <Button onClick={onOpen}>
        <i class="fa fa-eye" aria-hidden="true"></i>
    </Button>

    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bgColor="#121212" color="#ffffff">
          <DrawerCloseButton />
          <DrawerHeader display="flex" textColor="#ffffff">
            {selectedChat.chatName.toUpperCase()}
          </DrawerHeader>

          <DrawerBody>
            <FormControl display="flex">
                <Input
                    placeholder='ChannelName'
                    color="#b3b3b3"
                    mb = {3}
                    value={channelName}
                    onChange={(e)=>setChannelName(e.target.value)}
                />
                <Button
                    variant = "solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>    
            </FormControl>
            <FormControl>
                <Input 
                  color="#b3b3b3"
                  placeholder='Add Users...'
                  mb = {1}
                  onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            {loading?<Spinner size="lg" />
            :(
              searchResults?.slice(0,4).map((user)=>
                <UserList 
                  key = {user._id} 
                  user = {user} 
                  handleFunction = {()=>handleAddUser(user)}
                />
              )
            )}

            
          </DrawerBody>
            

            
          <DrawerFooter>
            <Box display="flex" flexDir="column">
                <Box w = "100%" display = "flex" flexWrap ="wrap">
                <Text>Channel Members</Text>
                {selectedChat.users.map((user)=>(
                    <UserListDelete
                        key = {user._id}
                        user = {user}
                        handleFunction ={()=>handleRemove(user)}
                    />    
                ))}
                </Box>
            </Box>
            
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      </>
  )
}

export default UpdateGroupChat
