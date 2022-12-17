import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import React, { useState } from "react";

const MyChats = React.lazy(() => import("../components/MyChats"));

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false);
  return (
    <Box w= "100%" m="5px" >
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
        )}
      </Box>
    </Box>
  );
};
export default ChatPage;
