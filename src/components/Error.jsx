import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      height="100vh"
      width="100%"
      alignItems="center"
      flexDirection="column"
    >
      <Text fontSize="12rem">404</Text>
      <Text fontSize="4.5rem">Not Found!</Text>

      <Button size="lg" variant="solid" colorScheme='green' rounded='20'>
        <Link to="/">Go Back</Link>
      </Button>
    </Box>
  );
}
export default Error;