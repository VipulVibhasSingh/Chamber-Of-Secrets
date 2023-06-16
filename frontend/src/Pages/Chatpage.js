import React, { useContext } from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { ChatContext } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideBar from '../components/SideBar'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const Chatpage = () => {
    const [fetchAgain, setFetchAgain] = useState(false); //useState is a React Hook that lets you add a state variable to your component.
    const ChatState = () => {
            return useContext(ChatContext)  //explanation in chat with vipul
    }
    const {user} = ChatState();

    const [chats,setChats] = useState([])

    const fetchChats = async () => {  //fetchChats is an async function which takes chats from the backend.
        const {data} = await axios.get('/api/chat');

        setChats(data);
    }

    useEffect(()=>{   //useEffect is a hook in react which runs when the component is run for the first time.
        fetchChats();
    },[])

  return (
    <>
    <div>
        {chats.map((chats)=>(
            <div key = {chats._id}>
                {chats.chatName}
            </div>    
        ))} 
    </div>
    <div style = {{width:'100%',backgroundColor:'#121212'}}>
        {user && <SideBar/>}
        <Box
            display="flex"
            justifyContent="space-between"
            w="100%"
            h="92vh"
            p="10px"
        >
            {user && <MyChats fetchAgain={fetchAgain}/>}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>

    </div>
    </>
  )
}

export default Chatpage
