import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  InputLeftElement,
  useToast
} from "@chakra-ui/react";

import './style.css';

import { useState,useReducer } from "react";

import { FaUserEdit } from 'react-icons/fa';
import { MdEmail, MdPassword } from "react-icons/md";

import {userReducer} from "../../states/reducers";
import ACTION from "../../states/actions"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ChatState } from "../../context/ChatProvider";

const SignUp = () => {

  const initialUserDetails = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    show: false,
    pic: "",
  };

  const [userDetails, dispatch] = useReducer(userReducer, initialUserDetails);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const {API_URL } = ChatState();

  const handleClick = () => {
    dispatch({ type: ACTION.setShow });
  }

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      return toast({
        title: "Please Select an Images!",
        description: "Image will be used for profile picture",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png' || pics.type === 'image/jpg') {
      const data = new FormData();
      data.append('file', pics);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", 'saurabhBisht17');
      axios.post("https://api.cloudinary.com/v1_1/saurabhBisht17/image/upload/", data)
        .then(({ data }) => {
          const url = new URL(data?.url);
          const resizeImg = "q_auto,f_auto,w_400,h_500,c_thumb,g_faces,z_0.75";
          const pathName = url.pathname;
          const origin = url.origin;
          const site = pathName.split('/');
          site.splice(4, 0, resizeImg);
          const path = site.join('/');
          dispatch({ type: ACTION.addProfile, upload: origin.concat(path) });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!userDetails.name || !userDetails.email || !userDetails.password || !userDetails.confirmPassword) {
      toast({
        title: "Please Fill all the Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (userDetails.password !== userDetails.confirmPassword) {
      toast({
        title: "Password Do Not Match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const userData = {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        pic: userDetails.pic
      }
      const { data } = await axios.post(`${API_URL}/api/user`, userData, config);
      toast({
        title: "Registration Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/login');
    } catch (e) {
      toast({
        title: "Error Occurred!",
        description: e.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing="5px">

        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <InputLeftElement children={<FaUserEdit />} />
            <Input
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) =>
                dispatch({ type: ACTION.setName, newName: e.target.value })
              }
              name="name"
              autoComplete="off"
              border="none"
              borderBottom="1px"
              focusBorderColor="#5d7723"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement children={<MdEmail />} />
            <Input
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) =>
                dispatch({ type: ACTION.setEmail, newEmail: e.target.value })
              }
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
              type={userDetails.show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) =>
                dispatch({
                  type: ACTION.setPassword,
                  addPassword: e.target.value,
                })
              }
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
                {userDetails.show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <InputLeftElement children={<MdPassword />} />
            <Input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) =>
                dispatch({
                  type: ACTION.setConfirmPass,
                  addConfirmPass: e.target.value,
                })
              }
              name="confirm_password"
              border="none"
              borderBottom="1px"
              focusBorderColor="#5d7723"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="first-name">
          <FormLabel>Upload Profile</FormLabel>
          <Input
            type="file"
            placeholder="Enter Your Name"
            onChange={(e) => postDetails(e.target.files[0])}
            name="name"
            border="none"
            className="input"
            p={1.5}
            accept="image/*"
          />
        </FormControl>
        <Button
          w="100%"
          sx={{ mt: 15 }}
          onClick={submitHandler}
          colorScheme={"linkedin"}
          isLoading={loading}
        >
          SignUp
        </Button>
      </VStack>
    </>
  );
};
export default SignUp;
