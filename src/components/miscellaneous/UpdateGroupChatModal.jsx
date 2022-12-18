import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { Suspense, useState } from "react";
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import './style.css';

const UserListItem = React.lazy(() => import("../userAvatar/UserListItem"));
const UserBadge = React.lazy(() => import("../userAvatar/UserBadge"));

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const {
    selectedChat,
    setSelectedChat,
    user,
    searchResults,
    loading,
    setLoading,
    optimizedHandleSearch,
    API_URL
  } = ChatState();
  const toast = useToast();

  const handleAddUser = async (user1) => {
    if (!user1) return;

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      return toast({
        title: "user already in group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isCloseable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return toast({
        title: "Error Occurred!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.put(
        `${API_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // If logged in user removed himself or left the group
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isCloseable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<FaEye />}
        variant="ghost"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Quicksand"
            display="flex"
            justifyContent="center"
            textTransform="capitalize"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDir="column"
            gap={3}
          >
            <Box>
              {selectedChat.users.map((u) => (
                <Suspense
                  key={u._id}
                  fallback={<h1 className="h1_loading">Loading...</h1>}
                >
                  <UserBadge user={u} handleFunction={() => handleRemove(u)} />
                </Suspense>
              ))}
            </Box>
            <FormControl>
              <Input
                type="text"
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                autoComplete="off"
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                type="text"
                // value={search}
                placeholder="Add Users eg: John,dane"
                autoComplete="off"
                onChange={(e) => optimizedHandleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResults?.slice(0, 4).map((user) => (
                <Suspense key={user._id} fallback={<h1>Loading...</h1>}>
                  <UserListItem
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                </Suspense>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateGroupChatModal;
