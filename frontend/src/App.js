import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chatpage from './Pages/Chatpage';
import Homepage from './Pages/Homepage';
import {useEffect, useState} from 'react'
import {ChatContext} from './context/ChatProvider';
import { useNavigate } from "react-router-dom";
import VideoConference from './components/VideoCall/VideoConference';

function App() {
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat] = useState("");
  const [chat,setChat] = useState([]);
  const [notification,setNotification] = useState([]);

  const history = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo)

    if(!userInfo) history('/')
   
  }, [history])

  return (
    <ChatContext.Provider value={{user, setUser,selectedChat,setSelectedChat,chat,setChat,notification,setNotification}}>
      <div className="App">
      <Routes>
        <Route path="/" exact element={<Homepage />} />     
        <Route path="/chats" element={<Chatpage />} />
        {/* <Route path ="/video" element={<VideoConference />} /> */}
      </Routes>
      </div>
    </ChatContext.Provider>
  );
}

export default App;
