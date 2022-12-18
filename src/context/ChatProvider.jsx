import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const API_URL = process.env.REACT_API_URL ?? "http://localhost:5000";

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
     setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = async (val) => {
    try {
      const search = val;
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${API_URL}/api/user?search=${search}`,
        config
      );

      const filteredData = data.filter((value) => {
        return search === ""
          ? value.name.toLowerCase().includes(search.toLowerCase())
          : value;
      });
      setSearchResults(filteredData);
      setLoading(false);
    } catch (err) {
      return toast({
        title: "Error Occurred",
        description: "Failed To Retrieve Search Results",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom",
      });
    }
  };

  const optimizedHandleSearch = debounce(handleSearch, 1000);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        searchResults,
        setSearchResults,
        loading,
        setLoading,
        optimizedHandleSearch,
        API_URL
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
