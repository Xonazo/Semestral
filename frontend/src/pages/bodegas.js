import { useState, useEffect } from "react";
import axios from "axios";
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
    Box,
    List,
    ListItem,
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel } from "@chakra-ui/react";
import NavBar from "../components/NavBar.jsx";

import { getBodegas, deleteBodega, updateBodega, createBodega } from "./api/bodegaApi.js";
import { getStock } from "./api/stockApi.js";
import { Tooltip } from '@chakra-ui/react';

const bodegaPage = () => {

    const [bodegas, setBodegas] = useState([]);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedBodegaId, setSelectedBodegaId] = useState(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [nombre, setNombre] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [stockData, setStockData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const bodegas = await getBodegas();
            setBodegas(bodegas);
        };
        fetchData();
        getBodegas();
    }, []);

    const handleDelete = async (id) => {
        setIsOpenDelete(false);
        await deleteBodega(id);
        const bodegasData = await getBodegas();
        setBodegas(bodegasData);
    };

    const handleEdit = (id) => {
        const bodega = bodegas.find((bodega) => bodega.id === id);
        setSelectedBodegaId(id);
        setNombre(bodega.nombre);
        setIsOpenEdit(true);
    };

    const handleSave = async () => {
        setIsOpenEdit(false);
        await updateBodega(selectedBodegaId, nombre);
        const bodegasData = await getBodegas();
        setBodegas(bodegasData);
    };

    const handleCreate = async () => {
        await createBodega(nombre);
        const bodegasData = await getBodegas();
        setBodegas(bodegasData);
        setIsOpen(false);
        setNombre("");
    };

    const handleGetStock = async (id_bodega) => {
        console.log(id_bodega);
        const stock = await getStock(id_bodega);
        console.log(stock);
        setStockData(stock);

        if (stock.length === 0) {
            setStockData(null); // Eliminar el valor anterior de stockData
          }

    };

    const onClose = () => {
        setIsOpenDrawer(false);
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
                            onClick={() => handleDelete(selectedBodegaId)}
                            ml={3}
                        >
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );



    //MODAL DE EDITAR
    const modalUpdate = (
        <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Bebida</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Nombre:</FormLabel>
                        <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
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


    //MODAL DE CREAR
    const modalCreate = (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Bebida</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Nombre:</FormLabel>
                        <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
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

    const drawerStock = (
        <Drawer isOpen={isOpenDrawer} placement="right" onClose={onClose}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Stock</DrawerHeader>
                <DrawerBody>
  {stockData ? (
    stockData.map((bodega, index) => (
      <Box key={index}>
        <Heading>{bodega.nombre_bodega}</Heading>
        <List>
          {bodega.items.map((item, index) => (
            <ListItem key={index}>
              <Text>{item.nombre_bebida} ({item.formato_bebida}) - Cantidad: {item.cantidad}</Text>
            </ListItem>
          ))}
        </List>
      </Box>
    ))
  ) : (
    <Text>Esta bodega no posee stock</Text>
  )}
</DrawerBody>
            </DrawerContent>
        </Drawer>
    );


    return (
        <>
            <NavBar />
            <Heading textAlign={"center"} mt={5} mb={5} color={"black"}>
                Lista de bodegas
            </Heading>
            <Container maxW="container.xl">
                <TableContainer>
                    <Table variant={"striped"} colorScheme="blackAlpha">
                        <Thead bg={"black"}>
                            <Tr>
                                <Th color={"white"}>Nombre</Th>
                                <Th color={"white"}>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bodegas.map((bodega) => (
                                <Tr key={bodega.id}>
                                    <Td>{bodega.nombre}</Td>
                                    <Td>
                                        <IconButton
                                            colorScheme="blue"
                                            aria-label="Editar"
                                            icon={<EditIcon />}
                                            mr={2}
                                            onClick={() => handleEdit(bodega.id)}

                                        />
                                        <IconButton
                                            colorScheme="red"
                                            aria-label="Eliminar"
                                            icon={<DeleteIcon />}
                                            mr={2}

                                            onClick={() => {
                                                setIsOpenDelete(true);
                                                setSelectedBodegaId(bodega.id);
                                            }}
                                        />
                                        <Tooltip label="ver Stock" placement="top">
                                            <IconButton
                                                colorScheme="green"
                                                aria-label="Ver Stock"
                                                icon={<PlusSquareIcon />}
                                                mr={2}
                                                onClick={() => {
                                                    setIsOpenDrawer(true);
                                                    handleGetStock(bodega.id)
                                                }}
                                            />
                                        </Tooltip>

                                    </Td>
                                </Tr>
                            ))}
                            {alertDialogContent}
                            {modalUpdate}
                            {modalCreate}
                            {drawerStock}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Box
                    textAlign={"center"}
                    mt={5}
                >
                    <Button colorScheme="blue" onClick={() =>
                        setIsOpen(true)}
                    >
                        Agregar Bodega
                    </Button>
                </Box>
            </Container>




        </>
    );
};




export default bodegaPage;

