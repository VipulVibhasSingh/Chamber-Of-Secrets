
import { Avatar, Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatProvider.js";

const UserList = ({user, handleFunction }) => {
  const ChatState = () => {
            return useContext(ChatContext)
  }

  //const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#b3b3b3"
      _hover={{
        background: "#404040",
        color: "white",
      }}
      w="100%"
      d="flex"
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
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserList;
