import { useState } from "react";
import {
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { FaUserAlt } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { setUser, setSelectedChat, API_URL } = ChatState();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      return toast({
        title: "Please Fill Login Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setSelectedChat('');
      setUser(data);
      setLoading(false);
      navigate("/chats");
    }
    catch (e) {
      setLoading(false);
      return toast({
        title: "Error Occurred!",
        description: e.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack spacing="25px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <InputGroup>
          <InputLeftElement children={<FaUserAlt />} />
          <Input
            type="email"
            value={email}
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            autoComplete="off"
            border="none"
            borderBottom="1px"
            focusBorderColor="#5d7723"
          />
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <InputLeftElement children={<MdPassword />} />
          <Input
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            border="none"
            borderBottom="1px"
            focusBorderColor="#5d7723"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              variant="ghost"
              _hover={{ bg: "#5d7723", color: "white" }}
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        w="100%"
        sx={{ mt: 15 }}
        onClick={submitHandler}
        colorScheme={"whatsapp"}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        w="100%"
        sx={{ mt: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        colorScheme={"facebook"}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};
export default Login;
