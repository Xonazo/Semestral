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
import { Divider } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";


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
    const [id_bodega, setid_bodega] = useState("");
    const [guia, setguia] = useState("");
    const [detalleBebida, setDetalleBebida] = useState("");
    const [detalleCantidad, setDetalleCantidad] = useState("");
    const [bebidas, setBebidas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [bodegaOrigenSeleccionada, setBodegaOrigenSeleccionada] = useState(null);
    const [isOpenDrawerTraspaso, setIsOpenDrawerTraspaso] = useState(false);
    const [traspasos, setTraspasos] = useState([]);
    const [isOpenEgreso, setIsOpenEgreso] = useState(false);
    const [egresoBodegaId, setEgresoBodegaId] = useState("");
    const [egresoProductos, setEgresoProductos] = useState([]);



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

        try {
            const nuevoTraspaso = {
                id_bodega_origen: id_bodega_origen,
                id_bodega_destino: id_bodega_destino,
                guia: guia,
                productos: productos.map((producto) => ({
                    bebida_id: producto.bebida_id,
                    cantidad: producto.cantidad,
                })),
            };

            await createTraspaso(id_bodega_origen, id_bodega_destino, guia, productos);
            const traspasos = await getTraspasoBodega(id_bodega_origen);
            setTraspasos(traspasos);
            setIsOpenTraspaso(false);
            setid_bodega_origen('');
            setid_bodega_destino('');
            setguia('');
            setProductos([]);
            console.log("Traspaso creado:", nuevoTraspaso);
        } catch (error) {
            console.log("Error al crear el traspaso:", error);
        }
    };
    const agregarProducto = () => {
        const nuevoProducto = {
            bebida_id: detalleBebida,
            bebida_nombre: bebidas.find((bebida) => bebida.id === detalleBebida).nombre,
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

    const handleEgreso = async () => {

        try {
            const nuevoEgreso = {
                id_bodega: id_bodega,
                productos: productos.map((producto) => ({
                    bebida_id: producto.bebida_id,
                    cantidad: producto.cantidad,
                })),
            };

            await createEgreso(id_bodega, productos);
            setIsOpenEgreso(false);
            setid_bodega("");
            setProductos([]);
            console.log("Egreso creado:", nuevoEgreso);
        } catch (error) {
            console.log("Error al crear el egreso:", error);
        }
    };
    const agregarProductoEgreso = () => {
        const nuevoProducto = {
            bebida_id: detalleBebida,
            bebida_nombre: bebidas.find((bebida) => bebida.id === detalleBebida).nombre,
            cantidad: detalleCantidad
        };
        setProductos([...productos, nuevoProducto]);
        setDetalleBebida(""); // Limpiar el campo de selección de bebida
        setDetalleCantidad(""); // Limpiar el campo de cantidad
    };

    const eliminarProductoEgreso = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos.splice(index, 1);
        setProductos(nuevosProductos);
    };

    

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

    const modalEgreso = (
        <Modal isOpen={isOpenEgreso} onClose={() => setIsOpenEgreso(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Realizar Egreso</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Bodega:</FormLabel>
                        <Select
                            value={id_bodega}
                            onChange={(e) => {
                                setid_bodega(e.target.value);
                                console.log("Valor seleccionado en Bodega:", e.target.value);
                            }}
                        >
                            {!id_bodega && <option value="">Seleccionar bodega</option>}                            {bodegas.map((bodega) => (
                                <option key={bodega.id} value={bodega.id}>
                                    {bodega.nombre}
                                </option>
                            ))}
                        </Select>
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
                            <Button colorScheme="teal" onClick={agregarProductoEgreso}>Agregar</Button> {/* Agregar el botón para agregar el producto */}
                        </Box>
                    </FormControl>

                    {/* Mostrar la lista de productos seleccionados */}
                    {productos.map((producto, index) => (
                        <div key={index}>
                            <p>Bebida: {producto.bebida_nombre}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            <Button onClick={() => eliminarProductoEgreso(index)}>Eliminar</Button> {/* Agregar el botón para eliminar el producto */}
                        </div>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setIsOpenEgreso(false)}>Cancelar</Button>
                    <Button colorScheme="blue" ml={3} onClick={handleEgreso}>
                        Egresar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );




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

    //MODAL DE CREAR
    const modalCreate = (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Bodega</ModalHeader>
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

    const imagesNoStock = [
        "no_stock_1.jpg",
        "no_stock_2.jpg",
        "no_stock_3.jpg",
      ];

    const drawerStock = (
        <Drawer isOpen={isOpenDrawer} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Flex align="center">
                Stock
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {stockData ? (
                stockData.map((bodega, index) => (
                  <Box key={index}>
                    <Heading>{bodega.nombre_bodega}</Heading>
                    <Divider my={2} color="black" /> {/* Línea separadora al principio del grupo de bebidas */}
                    <List>
                      {bodega.items.map((item, index) => (
                        <Box key={index}>
                          <Box display="flex" flexDirection="column">
                            <ListItem>
                              <Text fontSize="lg" fontWeight="bold">
                                {item.nombre_bebida}
                              </Text>
                            </ListItem>
                            <ListItem>
                              <Text fontSize="md">
                                Cantidad: {item.cantidad}
                              </Text>
                            </ListItem>
                          </Box>
                          {index < bodega.items.length - 1 && <Divider my={2} color="black" />} {/* Línea separadora entre elementos de bebidas */}
                        </Box>
                      ))}
                    </List>
                    <Divider my={4} color="black" /> {/* Línea separadora al final del grupo de bebidas */}
                  </Box>
                ))
              ) : (
                <>
                  {/* Mostrar imagen aleatoria cuando no hay stock */}
                  <Image src={imagesNoStock[Math.floor(Math.random() * imagesNoStock.length)]} alt="Imagen Aleatoria" />
                  <Text fontSize="xl" fontWeight="bold">Esta bodega no posee stock</Text>
                </>
              )}
            </DrawerBody>
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
                            {!id_bodega && <option value="">Seleccionar bodega para origen</option>}
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
                            {!id_bodega && <option value="">Seleccionar bodega para destino</option>}
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
                            <p>Bebida: {producto.bebida_nombre}</p>
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

    const images = [
        "SinTraspaso1.jpeg",
        "SinTraspaso2.jpeg",
        "SinTraspaso3.jpeg",
      ];

    const drawerTraspaso = (
        <Drawer isOpen={isOpenDrawerTraspaso} placement="right" onClose={onCloseTraspaso} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Historial de traspasos</DrawerHeader>
            <DrawerBody>
              {traspasos && traspasos.length > 0 ? (
                <>
                  <Heading>{traspasos[0].id_bodega_origen.nombre}</Heading>
                  {traspasos.map((traspaso) => (
                    <Box key={traspaso.id}>
                      <Divider mt={2} mb={2} />
                      <Text fontSize="lg" fontWeight="bold" color="black">Bodega Destino: {traspaso.id_bodega_destino.nombre}</Text> {/* Tamaño de fuente más grande para el nombre de Bodega Destino */}
                      <Text>Guia: {traspaso.guia}</Text>
                      <List>
                        {traspaso.detalles.map((detalles, index) => (
                          <ListItem key={index}>
                            <Text>
                              {detalles.nombre_bebida} ({detalles.formato_bebida}) - Cantidad: {detalles.cantidad}
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                      <Text>Fecha: {new Date(traspaso.created_at).toLocaleString()}</Text>
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  {/* Mostrar imagen aleatoria cuando no hay traspasos */}
                  <Image src={images[Math.floor(Math.random() * images.length)]} alt="Imagen Aleatoria" />
                  <Text fontSize="xl" fontWeight="bold">No hay traspasos disponibles</Text>
                </>
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
            <Container maxW="-moz-fit-content">
                <TableContainer>
                    <Table variant={"striped"} colorScheme="blackAlpha">
                        <Thead bg={"black"}>
                            <Tr>
                                <Th fontSize={"15px"} color={"white"} p={2}>Nombre</Th>
                                <Th fontSize={"15px"} color={"white"} p={2}>Acciones</Th>
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
                            {modalEgreso}
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
                    <Button colorScheme="orange" onClick={() => setIsOpenEgreso(true)}>
                        Realizar Egreso
                    </Button>
                </Box>
            </Container>




        </>
    );
};




export default bodegaPage;

