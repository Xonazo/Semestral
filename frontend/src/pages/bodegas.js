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
    Flex,
    Select
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

import { DeleteIcon, EditIcon, PlusSquareIcon, ArrowForwardIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel } from "@chakra-ui/react";
import NavBar from "../components/NavBar.jsx";

import { getBodegas, deleteBodega, updateBodega, createBodega } from "./api/bodegaApi.js";
import { getStock, createEgreso } from "./api/stockApi.js";
import { Tooltip } from '@chakra-ui/react';
import { createTraspaso, getTraspasoBodega } from "./api/traspasoApi.js";
import { getBebidas } from "./api/bebida.js";


const bodegaPage = () => {

    const [bodegas, setBodegas] = useState([]);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedBodegaId, setSelectedBodegaId] = useState(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [nombre, setNombre] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [stockData, setStockData] = useState(null);
    const [isOpenTraspaso, setIsOpenTraspaso] = useState(false);
    const [id_bodega_origen, setid_bodega_origen] = useState("");
    const [id_bodega_destino, setid_bodega_destino] = useState("");
    const [guia, setguia] = useState("");
    const [detalleBebida, setDetalleBebida] = useState('');
    const [detalleCantidad, setDetalleCantidad] = useState('');
    const [bebidas, setBebidas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [bodegaOrigenSeleccionada, setBodegaOrigenSeleccionada] = useState(null);
    const [isOpenDrawerTraspaso, setIsOpenDrawerTraspaso] = useState(false);
    const [traspasos, setTraspasos] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const bodegas = await getBodegas();
            setBodegas(bodegas);
        };
        fetchData();
        getBodegas();

    }, []);


    useEffect(() => {
        const fetchBebidas = async () => {
            const bebidasData = await getBebidas();
            setBebidas(bebidasData);
        };
        fetchBebidas();
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


    const handleTraspaso = async () => {



        await createTraspaso(id_bodega_origen, id_bodega_destino, guia, productos);
        setIsOpenTraspaso(false);
        setid_bodega_origen("");
        setid_bodega_destino("");
        setguia("");
        setProductos([]); // Limpiar la lista de productos
    };

    const agregarProducto = () => {
        const nuevoProducto = {
            bebida_id: detalleBebida,
            cantidad: detalleCantidad
        };
        setProductos([...productos, nuevoProducto]);
        setDetalleBebida(""); // Limpiar el campo de selección de bebida
        setDetalleCantidad(""); // Limpiar el campo de cantidad
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos.splice(index, 1);
        setProductos(nuevosProductos);
    };

    const handleGetTraspasoBodega = async (id_bodega) => {
        try {
            const traspasos = await getTraspasoBodega(id_bodega);
            console.log(traspasos);
            setTraspasos(traspasos);
            setIsOpenDrawerTraspaso(true);
        } catch (error) {
            console.log("Error al obtener los traspasos:", error);
            setTraspasos(null);
        }
    };

    const onCloseTraspaso = () => {
        setIsOpenDrawerTraspaso(false);
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
                <Button >Egreso de Stock</Button>
            </DrawerContent>
        </Drawer>

    );


    




    const modalTraspaso = (
        <Modal isOpen={isOpenTraspaso} onClose={() => setIsOpenTraspaso(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Realizar Traspaso</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Bodega Origen:</FormLabel>
                        <Select
                            value={id_bodega_origen}
                            onChange={(e) => {
                                setid_bodega_origen(e.target.value);
                                console.log("Valor seleccionado en Bodega Origen:", e.target.value);
                            }}
                        >
                            {bodegas.map((bodega) => (
                                <option key={bodega.id} value={bodega.id}>
                                    {bodega.nombre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bodega Destino:</FormLabel>
                        <Select
                            value={id_bodega_destino}
                            onChange={(e) => setid_bodega_destino(e.target.value)}
                        >
                            {bodegas.map((bodega) => (
                                <option key={bodega.id} value={bodega.id}>
                                    {bodega.nombre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Guia:</FormLabel>
                        <Input value={guia} onChange={(e) => setguia(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Productos:</FormLabel>
                        <Box display="flex" alignItems="center" mt={4}>
                            <Select
                                placeholder="Seleccionar Bebida"
                                value={detalleBebida}
                                width="200px"
                                onChange={(e) => setDetalleBebida(parseInt(e.target.value))}
                            >
                                {bebidas.map((bebida) => (
                                    <option key={bebida.id} value={bebida.id}>
                                        {bebida.nombre}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Cantidad"
                                mr={2}
                                width="100px"
                                value={detalleCantidad}
                                onChange={(e) => setDetalleCantidad(e.target.value)}
                            />

                            <Button colorScheme="teal" onClick={agregarProducto}>Agregar</Button> {/* Agregar el botón para agregar el producto */}
                        </Box>
                    </FormControl>

                    {/* Mostrar la lista de productos seleccionados */}
                    {productos.map((producto, index) => (
                        <div key={index}>
                            <p>Bebida: {producto.bebida_id}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            <Button onClick={() => eliminarProducto(index)}>Eliminar</Button> {/* Agregar el botón para eliminar el producto */}
                        </div>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setIsOpenTraspaso(false)}>Cancelar</Button>
                    <Button colorScheme="blue" ml={3} onClick={handleTraspaso}>
                        Traspasar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );


    const drawerTraspaso = (
        <Drawer isOpen={isOpenDrawerTraspaso} placement="right" onClose={onCloseTraspaso} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Historial de traspasos</DrawerHeader>
                <DrawerBody>
                    {traspasos && traspasos.length > 0 ? (
                        traspasos.map((traspaso) => (
                            <Box key={traspaso.id}>
                                <Heading>{traspaso.bodega_origen.nombre}</Heading>
                                <Text>Fecha: {traspaso.created_at}</Text>
                                <Text>Bodega Destino: {traspaso.bodega_destino.nombre}</Text>
                                {traspaso.detalles.length > 0 ? (
                                    <List>
                                        {traspaso.detalles.map((detalle) => (
                                            <ListItem key={detalle.id}>
                                                <Text>Bebida: {detalle.bebida.nombre}</Text>
                                                <Text>Formato: {detalle.bebida.formato}</Text>
                                                <Text>Cantidad: {detalle.cantidad}</Text>
                                                {/* Mostrar otros detalles del traspaso si es necesario */}
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Text>Esta bodega no tiene traspasos</Text>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Text>No hay traspasos disponibles</Text>
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
                                        <Tooltip label="Historial de traspasos" placement="top">
                                            <IconButton
                                                colorScheme="orange"
                                                aria-label="Historial de traspasos"
                                                icon={<InfoOutlineIcon />}
                                                mr={2}
                                                onClick={() => {
                                                    setIsOpenDrawerTraspaso(true);
                                                    handleGetTraspasoBodega(bodega.id)
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
                            {modalTraspaso}
                            {drawerTraspaso}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Box textAlign="center" mt={5} mb={5} display="flex" justifyContent="center" gap={4}>
                    <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
                        Agregar Bodega
                    </Button>
                    <Button colorScheme="green" onClick={() => setIsOpenTraspaso(true)}>
                        Realizar Traspaso
                    </Button>
                </Box>
            </Container>




        </>
    );
};




export default bodegaPage;

