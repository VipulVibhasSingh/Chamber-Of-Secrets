
import { Avatar, Box, Button, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatProvider.js";

const UserListDelete = ({user, handleFunction }) => {
  const ChatState = () => {
            return useContext(ChatContext)
  }

  const { selectedChat } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      display="flex"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.profilePic}
      />
      <Box display = "flex" >
        <Box >
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>       
        </Box>  
          <Box>
            <i class="fa-solid fa-xmark" ></i>
          </Box>
        </Box>
      </Box>
    );
};

export default UserListDelete;
