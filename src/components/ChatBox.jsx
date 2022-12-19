import { Box } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { ChatState } from "../context/ChatProvider";
const SingleChat = React.lazy(() => import("./SingleChat"));

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      boxShadow="2xl"
      alignItems="center"
      flexDir="column"
      h="87vh"
      pt={3}
      bg={
        !selectedChat
          ? "white"
          : "linear-gradient( 50.6deg,  rgba(24,138,141,1) 11.2%, rgba(96,221,142,1) 91.1% )"
      }
      color={!selectedChat ? "black" : "white"}
      w={{ base: "100%", md: "68%" }}
      rounded={20}
    >
      <Suspense fallback={<h1 className="h1_loading">Loading...</h1>}>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Suspense>
    </Box>
  );
}
export default ChatBox;