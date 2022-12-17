import { Avatar, Box, FormControl, IconButton, InputGroup, InputRightElement, Spinner, Text, Textarea, useToast } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { getSender, getSenderFull, getSenderPic } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import React, { useEffect, useState } from "react";
import './style.css';
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import  io  from 'socket.io-client';
import animationData   from "../animations/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "https://bingochat-api.onrender.com"; // replace the url with "https://YOUR_DEPLOYED_APPLICATION_URL" then run "npm run build" to create a production build in a production mode
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    // If no chat is selected, don't do anything
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      return toast({
        title: "Error Occurred",
        description: "Failed to Load the messages",
        status: "error",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: "true",
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages(); // Whenever users switches chat, call the function again

    //just to keep backup of whatever the selectedChat state is so that we can compare it and decide that if we emit the msg or give the notification to the user.
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    // receiving message from the socket
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat[0]?._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHeader = (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timeLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timeLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={2}
            px={2}
            w="100%"
            fontFamily="Quicksand"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaArrowLeft />}
              onClick={() => setSelectedChat("")}
              variant="ghost"
              _hover={{ bg: "#f4f4f4", color: "#387002" }}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <Box textTransform="capitalize">
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    //name={selectedChat.users[1].name}
                    name={getSender(user, selectedChat?.users)}
                    src={getSenderPic(user, selectedChat?.users)}
                    loading="lazy"
                  />
                  {getSender(user, selectedChat?.users)}
                </Box>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>

          {/* messages */}

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="white"
            color="black"
            w="100%"
            h="100%"
            rounded={20}
            boxShadow="2xl"
            borderTopRightRadius={0}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                m="auto"
                alignSelf="center"
                color="green"
              />
            ) : (
              <Box
                className="messages"
                color="black"
                marginBottom={2}
                fontFamily="Quicksand"
              >
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </Box>
            )}

            {isTyping ? (
              <Box>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ margin: 0, background: "transparent" }}
                />
              </Box>
            ) : (
              <></>
            )}

            <FormControl
              onKeyDown={sendMessage}
              isRequired
              display="flex"
              flexDir="column"
              justifyContent="space-between"
              rounded={20}
            >
              <InputGroup>
                <Textarea
                  className="input"
                  type="text"
                  minH="unset"
                  variant="filled"
                  placeholder="Type a message"
                  onChange={typingHeader}
                  value={newMessage}
                  rounded={20}
                />
                <InputRightElement
                  children={
                    <IconButton
                      variant="ghost"
                      rounded={20}
                      color="#387002"
                      _hover={{ bg: "#558b2f", color: "white" }}
                      icon={<IoSend />}
                      onClick={sendMessage}
                    />
                  }
                />
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Quicksand,Arial">
            Click on a user to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
