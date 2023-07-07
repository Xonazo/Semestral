import React from "react";
import { Box, Flex, Spacer, Link, Heading } from "@chakra-ui/react";

const NavBar = () => {

  return (
    <Box bg="black" px={8} py={6}>
      <Flex align="center" px={40}>
        <Heading size="md" color="white">
          Logo
        </Heading>
        <Spacer />
        <Box >
          <Link mx={2} color="white" _hover={{ textDecoration: "underline" }} href="/"  fontSize={20}>
            Inicio
          </Link>
          <Link mx={2} color="white" _hover={{ textDecoration: "underline" }}  fontSize={20}>
            Acerca de
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;