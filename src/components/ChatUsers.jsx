import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import { getSender, getSenderPic } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import LatestMessage from "./LatestMessage";

const ChatUsers = ({loggedUser}) => {
    const { selectedChat, setSelectedChat, user, chats} =
      ChatState();
  return (
    <>
      {chats.length ? (
        <Stack overflowY="scroll">
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              display="flex"
              flexDir="column"
              cursor="pointer"
              fontFamily="quicksand"
              fontSize="1.4rem"
              bg={
                selectedChat === chat
                  ? "linear-gradient(20.6deg,  rgba(24,138,141,1) 11.2%, rgba(96,221,142,1) 91.1% )"
                  : ""
              }
              color={selectedChat === chat ? "white" : "black"}
              _hover={{
                background: selectedChat === chat ? "" : "#eeeeee",
                color: selectedChat === chat ? "white" : "black",
              }}
              px={3}
              py={2}
              rounded={10}
              key={chat._id}
            >
              <Box display="flex">
                <Avatar
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={!chat.isGroupChat ? chat.users[1]?.name : chat?.name}
                  src={!chat.isGroupChat ? getSenderPic(user, chat.users) : ""}
                  loading="lazy"
                />

                <Text textTransform="capitalize">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>

              <LatestMessage loggedUser={loggedUser} chat={chat} />
            </Box>
          ))}
        </Stack>
      ) : (
        <Text textAlign="center" m="auto" fontSize="xl">
          Click On The Chat Icon to add Users
        </Text>
      )}
    </>
  );
}
export default ChatUsers;