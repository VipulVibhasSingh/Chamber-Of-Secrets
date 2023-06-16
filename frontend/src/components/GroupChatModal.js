import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserList from './UserList';

const GroupChatModal = ({children}) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [channelName,setChannelName] = useState();
    const [selectedUsers,setSelectedUsers] = useState([]);
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [searchResults,setSearchResults] = useState([]);

    const toast = useToast();

     const ChatState = () => {
            return useContext(ChatContext)
    }

    const {user,setSelectedChat,chat,setChat,selectedChat} = ChatState();

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

    const handleSubmit = async () => {
      if (!channelName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chat/group`,
          {
            name: channelName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChat([data, ...chat]);
        onClose();
        toast({
          title: "New Channel Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Channel!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    const handleChannel = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)){
        toast({
                title: "User Already Added!",
                status: "warning",
                duration:5000,
                isClosable:true,
                position:'top'
          });
          return;
      }

      setSelectedUsers([...selectedUsers,userToAdd]);
    }

    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== delUser._id));
    }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display = "flex"
            justifyContent="center"
          >Create a Channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <FormControl>
                <Input 
                  placeholder='Channel Name'
                  mb = {3}
                  onChange={(e)=>setChannelName(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <Input 
                  placeholder='Add Users...'
                  mb = {1}
                  onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            <Box w = "100%" display="flex">  
              {selectedUsers.map((user)=>
                <UserBadgeItem 
                  key = {user._id}
                  user = {user}
                  handleFunction = {()=>handleDelete(user)} 
                /> 
              
              )}
            </Box>    
            {loading?<div>loading</div>
            :(
              searchResults?.slice(0,4).map((user)=>
                <UserList 
                  key = {user._id} 
                  user = {user} 
                  handleFunction = {()=>handleChannel(user)}
                />
              )
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}> 
              Create Channel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
