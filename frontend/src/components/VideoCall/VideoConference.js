import { Box, Center, useDisclosure } from '@chakra-ui/react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatProvider';

const VideoConference = () => {

     const ChatState = () => {
            return useContext(ChatContext)
    }
    const {user,selectedChat,setSelectedChat} = ChatState();

    

    const MyMeeting = async(element) => {
        const appID = 1494730031
        const serverSecret = "4082ff5dba4e8b2bbdc24a358467e0fb"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,selectedChat._id,user._id,user.name);

        const zp =ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container:element,
            scenario:{
                mode:ZegoUIKitPrebuilt.GroupCall,
            }
            

        })
    }


  return (
    <Center>
        <Box>
            <div ref ={MyMeeting} />
        </Box>
    </Center> 
  )
}

export default VideoConference
