import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast,
  FormControl,
  Box,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { Suspense, useState } from "react";
import { ChatState } from "../../context/ChatProvider";

const UserListItem = React.lazy(() => import("../userAvatar/UserListItem"));
const UserBadge = React.lazy(() => import("../userAvatar/UserBadge"));

const GroupChatModal = ({ children }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    user,
    chats,
    setChats,
    searchResults,
    setSearchResults,
    loading,
    optimizedHandleSearch,
  } = ChatState();

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
      return toast({
        title: "Please fill all the fields",
        description: "Filled are empty",
        duration: 5000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      setGroupName("");
      setSearchResults([]);
      setSelectedUsers([]);
      return toast({
        title: "Congratulation",
        description: `New Group ${groupName} created`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      return toast({
        title: "Error Occurred",
        description: `Group cannot be created`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: "Cannot Add The User",
        description: "User already added",
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(90deg)"
        />
        <ModalContent m={0}>
          <ModalHeader
            fontSize="40px"
            fontFamily="Quicksand"
            display="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDir="column"
            gap={3}
          >
            <FormControl>
              <Input
                type="text"
                value={groupName}
                placeholder="Enter Group Name"
                autoComplete="off"
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
            </FormControl>

            {/* render searched users as badges*/}
            <Box
              display="flex"
              flexWrap="wrap"
              maxHeight="15vh"
              overflowY="scroll"
            >
              {selectedUsers?.map((users) => (
                <Suspense key={user._id} fallback={<h1>Loading...</h1>}>
                  <UserBadge
                    pic={users.pic}
                    user={users}
                    handleFunction={() => handleDelete(users)}
                  />
                </Suspense>
              ))}
            </Box>

            <FormControl>
              <Input
                type="text"
                // value={search}
                placeholder="Add minimum 2 or more Users eg: John,dane "
                autoComplete="off"
                onChange={(e) => optimizedHandleSearch(e.target.value)}
              />
            </FormControl>

            {/* search Users */}
            <Box w="100%" maxHeight="35vh" overflowY="scroll" px={2}>
              {loading ? (
                <Spinner ml="auto" display="flex" />
              ) : (
                searchResults?.map((user) => (
                  <Suspense key={user._id} fallback={<h1>Loading...</h1>}>
                    <UserListItem
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  </Suspense>
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="linkedin" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
