import React, { Suspense, useState } from "react";
import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Avatar,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import {FaBell, FaChevronDown } from "react-icons/fa";
import { BsFillChatLeftTextFill } from "react-icons/bs";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import { getSender } from '../../config/ChatLogics.js';
import '../style.css';

const ProfileModal = React.lazy(() => import("./ProfileModal"));
const UserListItem = React.lazy(() => import("../userAvatar/UserListItem"));

const SideDrawer = () => {
  
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    searchResults,
    loading,
    optimizedHandleSearch,
    API_URL
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id))
        // If the chat already inside 'chat' state, append it
        setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      setLoadingChat(false);
      return toast({
        title: 'Error fetching the chat',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px 5px 10px"
        rounded="10px"
        boxShadow="2xl"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <BsFillChatLeftTextFill size="1.5rem" />
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "1rem", sm: "3xl" }}
          fontFamily="Poppins"
          fontWeight="900"
          bg="linear-gradient(50deg, #08AEEA 0%, #2AF598 100%)"
          color="transparent"
          sx={{ WebkitBackgroundClip: "text" }}
          letterSpacing={{base:'4px', sm:'5px'}}
        >
          BINGO-CHAT
        </Text>
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              className="notification-badge-container"
            >
              <FaBell size="1rem" />
              {notification.length > 0 && (
                <span className="notification-badge">
                  {notification.length > 9 ? "9+" : notification.length}
                </span>
              )}
            </MenuButton>
            <MenuList p={2}>
              {!notification.length ? "No new messages" : ""}
              {notification.map((notify, i) => (
                <MenuItem
                  key={notify._id + i}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New Message in ${notify.chat.chatName}`
                    : `New Message From ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<FaChevronDown />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                loading="lazy"
              />
            </MenuButton>
            <MenuList p={0}>
              <Suspense fallback="h1_loading">
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
              </Suspense>
              <MenuDivider m={0} />
              <MenuItem onClick={logOutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search By Name Or Email"
                  mr={2}
                  onChange={(e) => optimizedHandleSearch(e.target.value)}
                />
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResults?.map((user) => (
                  <Suspense
                    key={user._id}
                    fallback={<h1 className="h1_loading">Loading...</h1>}
                  >
                    <UserListItem
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  </Suspense>
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};
export default SideDrawer;
