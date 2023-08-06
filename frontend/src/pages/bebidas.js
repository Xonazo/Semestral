import { useState, useEffect } from "react";
import axios from "axios";
import { getBebidas, deleteBebida, updateBebida, createBebida } from "../pages/api/bebida";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Container,
  Heading,
  Button,
  IconButton,
  Box
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import {  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { Select } from '@chakra-ui/react';
import NavBar from "../components/NavBar.jsx";



const bebidaPage = () => {
  const [bebidas, setBebidas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBebidaId, setSelectedBebidaId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [formato, setFormato] = useState("");
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const[isOpenDelete, setIsOpenDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const bebidas = await getBebidas();
      setBebidas(bebidas);
    };
    fetchData();
    getBebidas();
  }, []);

  const handleDelete = async (id) => {
    setIsOpenDelete(false);
    await deleteBebida(id);
    const bebidasData = await getBebidas();
    setBebidas(bebidasData);
  };

  const handleEdit = (id) => {
    const bebida = bebidas.find((bebida) => bebida.id === id);
    setSelectedBebidaId(id);
    setNombre(bebida.nombre);
    setFormato(bebida.formato);
    setIsOpenEdit(true);
  };

const handleSave = async () => {
  await updateBebida(selectedBebidaId, nombre, formato);
  const bebidasData = await getBebidas();
  setBebidas(bebidasData);
  setIsOpenEdit(false);
};


const handleCreate = async () => {
  await createBebida(nombre, formato);
  const bebidasData = await getBebidas();
  setBebidas(bebidasData);
  setIsOpen(false);
  setNombre(""); 
  setFormato("");
};


    //AVISO DE ELIMINAR
  const alertDialogContent = (
    <AlertDialog isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Eliminar Bebida
          </AlertDialogHeader>
          <AlertDialogBody>
            ¿Estás seguro de que deseas eliminar esta bebida?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => setIsOpenDelete(false)}>Cancelar</Button>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(selectedBebidaId)}
              ml={3}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  const modalUpdate = (
    <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Bebida</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nombre:</FormLabel>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Formato:</FormLabel>
            <Select value={formato} onChange={(e) => setFormato(e.target.value)}>
              <option value="">Seleccionar formato</option>
              <option value="150 ml">150 ml</option>
              <option value="200 ml">200 ml</option>
              <option value="250 ml">250 ml</option>
              <option value="300 ml">300 ml</option>
              <option value="330 ml">330 ml</option>
              <option value="350 ml">350 ml</option>
              <option value="375 ml">375 ml</option>
              <option value="500 ml">500 ml</option>
              <option value="600 ml">600 ml</option>
              <option value="750 ml">750 ml</option>
              <option value="1 L">1 L</option>
              <option value="1.5 L">1.5 L</option>
              <option value="2 L">2 L</option>
              <option value="2.5 L">2.5 L</option>
              <option value="3 L">3 L</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsOpenEdit(false)}>Cancelar</Button>
          <Button colorScheme="blue" ml={3} onClick={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

    const modalCreate = (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Bebida</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre:</FormLabel>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Formato:</FormLabel>
              <Select value={formato} onChange={(e) => setFormato(e.target.value)}>
                <option value="">Seleccionar formato</option>
                <option value="150 ml">150 ml</option>
                <option value="200 ml">200 ml</option>
                <option value="250 ml">250 ml</option>
                <option value="300 ml">300 ml</option>
                <option value="330 ml">330 ml</option>
                <option value="350 ml">350 ml</option>
                <option value="375 ml">375 ml</option>
                <option value="500 ml">500 ml</option>
                <option value="600 ml">600 ml</option>
                <option value="750 ml">750 ml</option>
                <option value="1 L">1 L</option>
                <option value="1.5 L">1.5 L</option>
                <option value="2 L">2 L</option>
                <option value="2.5 L">2.5 L</option>
                <option value="3 L">3 L</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button colorScheme="blue" ml={3} onClick={handleCreate}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
    



  return (
    <div>
      <NavBar />
      <Heading textAlign={"center"} mt={5} mb={5} color={'black'}
      >Lista de Bebidas
      </Heading>
      <Container
        maxW="-moz-fit-content">
        <TableContainer  >
          <Table variant='striped' colorScheme='blackAlpha'  >
            <Thead bg={'black'} >
              <Tr>
                <Th fontSize={"15px"} color={'white'} p={3}>Nombre</Th>
                <Th fontSize={"15px"} color={'white'} p={3}>Formato</Th>
                <Th fontSize={"15px"} color={'white'} p={3}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bebidas.map((bebida) => (
                <Tr key={bebida.id}>
                  <Td>{bebida.nombre}</Td>
                  <Td>{bebida.formato}</Td>
                  <Td>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    title="Editar"
                    aria-label="Editar"
                    mr={2}

                    onClick={() => handleEdit(bebida.id)}
                  />
                  </Td>
                </Tr>
              ))}
              {alertDialogContent}
              {modalUpdate}
              {modalCreate}
            </Tbody>
          </Table>
        </TableContainer>
        <Box
        textAlign={"center"}
        mt={5}

        >
        <Button colorScheme="green" onClick={() => setIsOpen(true)}>Crear Bebida</Button>
        </Box>
      </Container>
    </div>
  );
};

export default bebidaPage;