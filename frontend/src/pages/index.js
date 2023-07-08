import styles from '@/styles/Home.module.css'
import { Heading, Container, Text, Center } from "@chakra-ui/react";
import Navbar from '../components/NavBar.jsx';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Image,
  Box,
  Icon,
  Stack
}
  from '@chakra-ui/react'


export default function Home() {
  return (
    <div>
      <Navbar />
      <Flex
        justifyContent="center"
        alignItems="center"
        h="calc(100vh - 70px)"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(barrera-envases-pet.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          onClick={() => { window.location.href = "/bebidas" }}
          width="200px"
          height="180px"
          backgroundColor="rgba(255, 255, 255, 0.5)" // Color blanco con una opacidad del 50%
          marginRight="2rem"
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.1)"
          }}
        >
          <Stack justifyContet="center" align={"center"}>
            <img src='bebidaIcon.svg' alt="Creacion Bebidas" style={{ maxWidth: "50%", maxHeight: "50%" }} />
            <Text color="black" marginTop="0.5rem" >Bebidas</Text>
          </Stack>
        </Box>
        <Box
          width="200px"
          height="180px"
          backgroundColor="rgba(255, 255, 255, 0.5)" // Color blanco con una opacidad del 50%
          marginRight="2rem"
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.1)"
          }}
        >
          <Stack justifyContet="center" align={"center"}>
            <img src='bodegaIcon.svg' alt="Creacion Bebidas" style={{ maxWidth: "50%", maxHeight: "50%" }} />
            <Text color="black" marginTop="0.5rem" >Bodega</Text>
          </Stack>
        </Box>
        <Box
          width="200px"
          height="180px"
          backgroundColor="rgba(255, 255, 255, 0.5)" // Color blanco con una opacidad del 50%
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.1)"
          }}
        >
          <Stack justifyContet="center" align={"center"}>
            <img src='camionIcon.svg' alt="Creacion Bebidas" style={{ maxWidth: "50%", maxHeight: "50%" }} />
            <Text color="black" marginTop="0.5rem" >Ingreso</Text>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}