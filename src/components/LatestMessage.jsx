import { Text } from "@chakra-ui/react";
const LatestMessage = ({ loggedUser,chat }) => {
  return (
    <>
      {chat.latestMessage ? (
        <Text fontSize="xs" ml={10}>
          <b>
            {!chat.isGroupChat
              ? (loggedUser._id === chat.latestMessage.sender._id
                ? "You: "
                : "")
              : (loggedUser._id === chat.latestMessage.sender._id
              ? "You: "
              : `${chat.latestMessage.sender.name}: `)}
          </b>
          {chat.latestMessage.content.length > 50
            ? chat.latestMessage.content.substring(0, 51) + "..."
            : chat.latestMessage.content}
        </Text>
      ) : (
        <></>
      )}
    </>
  );
}
export default LatestMessage;