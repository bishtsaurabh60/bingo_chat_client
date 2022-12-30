import { ChatState } from "../context/ChatProvider";
import React, { Suspense, useEffect, useState } from "react";
import {Box, Button,useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

import ChatLoading from "./ChatLoading";
import ChatUsers from "./ChatUsers";

const GroupChatModal = React.lazy(() =>
  import("./miscellaneous/GroupChatModal")
);

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loadingChat, setLoadingChat] = useState(false);
  const { selectedChat,user, setChats, API_URL } = ChatState();
  const toast = useToast();
  const { onClose } = useDisclosure();

  const fetchChats = async () => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/chat`, config);

      setChats(data);
      setLoadingChat(false);
      onClose(); //close the side drawer
    } catch (err) {
      setLoadingChat(false);
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
        <Suspense fallback={<div></div>}>
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
        {!loadingChat ? (
          <ChatUsers loggedUser={loggedUser}/>
        ) : (
              <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
