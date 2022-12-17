import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { Suspense, useEffect } from "react";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import Login from "../components/authentication/Login";
import { useNavigate } from "react-router-dom";
import '../App.css';

const SignUp = React.lazy(()=>import("../components/authentication/SignUp"));

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) navigate('/chats');
  }, [navigate]);
  
  return (
    <Container
      maxW={{ sm: "100vh", lg: "xl" }}
      display="flex"
      flexDirection={{ base: "column", sm: "row" }}
      alignItems="center"
      justifyContent="center"
      p={{ md: "5rem", lg: "0" }}
      gap='0.5rem'
    >
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w={{sm:"20%",base:'100%'}}
        minHeight={{ lg: "95vh", sm: "80vh" }}
        m="14px 10px 14px 10px"
        rounded="xl"
        backgroundImage="linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
        color="white"
        boxShadow="2xl"
      >
        <Text
          display={"flex"}
          justifyContent="center"
          alignItems="center"
          fontFamily="raleway"
          fontWeight="700"
          fontSize="4xl"
          sx={{
            writingMode: {sm:"vertical-lr"},
            textOrientation: {sm:"upright"},
            wordWrap: {sm:"wrap"},
          }}
        >
          BINGO
          <BsFillChatLeftTextFill color="white" style={{ margin: "15px" }} />
          CHAT
        </Text>
      </Box>
      <Box
        boxShadow="2xl"
        bg="white"
        w="100%"
        h={{ lg: "95vh", sm: "80vh" }}
        p={4}
        rounded="xl"
        fontFamily="Raleway"
      >
        <Tabs variant="soft-rounded" colorScheme="whatsapp" align="center">
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">SignUp</Tab>
          </TabList>
          <TabPanels display="flex" alignItems="center" justifyContent="center">
            <TabPanel width="100%">
              <Login />
            </TabPanel>
            <TabPanel width="100%">
              <Suspense fallback={<h1 className="h1_loading">Loading</h1>}>
                <SignUp />
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
export default HomePage;
