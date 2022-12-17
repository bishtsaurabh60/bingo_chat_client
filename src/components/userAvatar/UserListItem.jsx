import { Avatar, Box, Text} from "@chakra-ui/react";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      fontFamily="Quicksand"
      cursor="pointer"
      _hover={{ background: "#689f38", color: "white" }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      pt={2}
      pb={2}
      rounded="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        loading="lazy"
      />
      <Box>
        <Text textTransform="capitalize">{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};
export default UserListItem