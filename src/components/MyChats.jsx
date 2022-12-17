import { ChatState } from "../context/ChatProvider";
import React, { Suspense, useEffect, useState } from "react";
import { Avatar, Box, Button, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderPic } from "../config/ChatLogics";

const GroupChatModal = React.lazy(() =>
  import("./miscellaneous/GroupChatModal")
);

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const { onClose } = useDisclosure();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      onClose(); //close the side drawer
    } catch (err) {
      return toast({
        title: "Error Occurred!",
        description: "Failed to Load the Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      h="87vh"
      rounded={20}
      boxShadow="2xl"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Quicksand"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
      >
        Chats
        <Suspense fallback={<h1>Loading...</h1>}>
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<FaPlus />}
            >
              Create Group
            </Button>
          </GroupChatModal>
        </Suspense>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        rounded={10}
        overflowY="hidden"
      >
        {chats ? (
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
                    src={
                      !chat.isGroupChat ? getSenderPic(user, chat.users) : ""
                    }
                    loading='lazy'
                  />

                  <Text textTransform="capitalize">
                    {!chat.isGroupChat && loggedUser
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>

                {chat.latestMessage ? (
                  <Text fontSize="xs" ml={10}>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                ) : (
                  <></>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
