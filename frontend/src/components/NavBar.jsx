import React from "react";
import { Box, Flex, Spacer, Link, Image } from "@chakra-ui/react";

const NavBar = () => {

  return (
    <Box bg="black" px={8} py={5}>
      <Flex align="center" px={20}>
        <Link href="/">
          <Image src="logo.png" alt="Logo" boxSize="60px" />
        </Link>
        <Spacer />
        <Box>
        <Link mx={5} color="white" _hover={{ textDecoration: "underline" }} href="/" fontSize={20}>
            Inicio
          </Link>
          <Link mx={5} color="white" _hover={{ textDecoration: "underline" }} href="/bebidas" fontSize={20}>
            Bebidas
          </Link>
          <Link mx={5} color="white" _hover={{ textDecoration: "underline" }} href="/bodegas" fontSize={20}>
            Bodegas
          </Link>
          <Link mx={5} color="white" _hover={{ textDecoration: "underline" }} href="/ingreso" fontSize={20}>
            Ingresos
          </Link>
          
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;