import { Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import SingleChat from './chatLogics/SingleChat'

const ChatBox = ({ fetchAgain,setFetchAgain }) => {

  const ChatState = () => {
            return useContext(ChatContext)
    }

    const {selectedChat,user} = ChatState();



  return (
    <Box
      display={{base:selectedChat ? "flex" : "none" ,md:"flex"}}
      w = {{base:"100%" , md:"90%"}}
      bg="#1a3246"
      alignItems="center"
      p = {3}
      flexDirection="column"
      borderRadius="5px"
      boxShadow="dark-lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
