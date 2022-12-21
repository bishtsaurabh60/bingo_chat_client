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
  IconButton,
  Image,
  Text, 
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

const ProfileModal = ({user,children,fetchAgain,setFetchAgain}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton
            display={{ base: "flex" }}
            icon={<FaEye />}
            onClick={onOpen}
            variant="ghost"
            _hover={{ bg: "#f4f4f4", color: "#387002" }}
          />
        )}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(5px) hue-rotate(90deg)"
          />
          <ModalContent height="410px">
            <ModalHeader
              fontSize="40px"
              fontFamily="Quicksand"
              display="flex"
              justifyContent="center"
              textTransform="capitalize"
            >
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDir="column"
            >
              <Image
                rounded="50%"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
                loading="lazy"
              />
              <Text fontSize={{ base: "28px", md: "30px" }}>
                Email :- {user.email}
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="linkedin" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};
export default ProfileModal;
