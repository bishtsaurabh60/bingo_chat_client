import { Avatar, Tag, TagCloseButton} from "@chakra-ui/react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Tag size="sm" textTransform='capitalize' colorScheme="red" borderRadius="full" m={1}>
      <Avatar src={user.pic} loading='lazy' size="xs" name={user.name} ml={-1} mr={2} />
      {user.name}
      <TagCloseButton onClick={handleFunction} />
    </Tag>
  );
}
export default UserBadge;