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
    ListIcon,
    OrderedList,
    Select,
    Flex,
} from '@chakra-ui/react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { getBodegas } from "./api/bodegaApi";
import { getIngresoBodega, createIngresoBodega } from "./api/ingresoApi";
import NavBar from "../components/NavBar.jsx";
import { Divider } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { getBebidas } from "./api/bebida";

const ingresoPage = () => {
    const [bodegas, setBodegas] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
    const [guia, setGuia] = useState("");
    const [detalles, setDetalles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [detalleBebida, setDetalleBebida] = useState('');
    const [detalleCantidad, setDetalleCantidad] = useState('');
    const [bebidas, setBebidas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const bodegas = await getBodegas();
            setBodegas(bodegas);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBebidas = async () => {
            const bebidasData = await getBebidas();
            setBebidas(bebidasData);
        };
        fetchBebidas();
    }, []);

    const handleIngreso = async (id) => {
        const ingresos = await getIngresoBodega(id);
        console.log(ingresos);
        setBodegaSeleccionada(id);

        if (ingresos.length === 0) {
            setIngresos(null);
        } else {
            setIngresos(ingresos);
        }
    };

    const handleCreateIngreso = async () => {
        try {
            const nuevoIngreso = {
                id_bodega: bodegaSeleccionada,
                guia: guia,
                detalles: detalles.map((detalle) => ({
                    bebida_id: detalle.bebida_id,
                    cantidad: detalle.cantidad,
                })),
            };

            await createIngresoBodega(bodegaSeleccionada, guia, detalles);
            const ingresos = await getIngresoBodega(bodegaSeleccionada);
            setIngresos(ingresos);
            setIsOpen(false);
            setGuia('');
            setDetalles([]);
            console.log('Ingreso creado:', nuevoIngreso);
        } catch (error) {
            console.log('Error al crear el ingreso:', error);
            // Manejar el error aquí según tus necesidades
        }
    };
    const handleAgregarDetalle = () => {
        const nuevoDetalle = {
            bebida_id: detalleBebida,
            cantidad: detalleCantidad,
        };
        setDetalles([...detalles, nuevoDetalle]);
        setDetalleBebida('');
        setDetalleCantidad('');
    };

    const handleEliminarDetalle = (index) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };




    //MODAL DE CREAR
    const modalCreate = (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Ingreso</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Guía:</FormLabel>
                        <Input value={guia} onChange={(e) => setGuia(e.target.value)} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Detalles:</FormLabel>
                        <Box display="flex" alignItems="center" mt={4}>
                            <Select
                                placeholder="Seleccionar bebida"
                                value={detalleBebida}
                                onChange={(e) => setDetalleBebida(parseInt(e.target.value))}
                                mr={2}
                                width="200px" // Ancho ajustable según tus necesidades
                            >
                                {bebidas.map((bebida) => (
                                    <option key={bebida.id} value={bebida.id}>
                                        {bebida.nombre}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Cantidad"
                                value={detalleCantidad}
                                onChange={(e) => setDetalleCantidad(e.target.value)}
                                mr={2}
                                width="100px" // Ancho ajustable según tus necesidades
                            />
                            <Button colorScheme="teal" onClick={handleAgregarDetalle}>
                                Agregar
                            </Button>
                        </Box>
                        <Box mt={2}>
                            {detalles.map((detalle, index) => {
                                const bebida = bebidas.find((bebida) => bebida.id === detalle.bebida_id);
                                const nombreBebida = bebida ? bebida.nombre : '';
                                return (
                                    <Box key={index} display="flex" alignItems="center" mt={2}>
                                        <Text mr={2}>
                                            Nombre: {nombreBebida}, Cantidad: {detalle.cantidad}
                                        </Text>
                                        <Button colorScheme="red" size="sm" onClick={() => handleEliminarDetalle(index)}>
                                            Eliminar
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button colorScheme="blue" ml={3} onClick={handleCreateIngreso}>
                        Crear
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );



    return (
        <>
        <NavBar />
            <Heading as="h1" size="xl" textAlign="center" mb={5}>
                Ingresos
            </Heading>
            <Box maxWidth="500px" mx="auto">
                <Accordion allowMultiple>
                    {bodegas.map((bodega) => (
                        <AccordionItem key={bodega.id}>
                            <AccordionButton onClick={() => handleIngreso(bodega.id)}>
                                <Box flex="1" textAlign="left">
                                    {bodega.nombre}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            {bodegaSeleccionada === bodega.id && (
                                <AccordionPanel pb={4}>
                                    {ingresos ? (
                                        <>
                                            {ingresos.map((ingreso, index) => (
                                                <Box key={ingreso.id} pl={4} mb={index !== 0 ? 4 : 0}>
                                                    <Text fontWeight="bold">Guía: {ingreso.guia}</Text>
                                                    <Text>
                                                        Fecha de creación:{' '}
                                                        {new Intl.DateTimeFormat('es-ES', {
                                                            dateStyle: 'full',
                                                            timeStyle: 'long',
                                                        }).format(new Date(ingreso.created_at))}
                                                    </Text>
                                                    <Text fontWeight="bold">Detalles:</Text>
                                                    {ingreso.detalles.map((detalle) => (
                                                        <Text key={detalle.bebida_id}>
                                                            Nombre: {detalle.nombre_bebida}, Cantidad: {detalle.cantidad}
                                                        </Text>
                                                    ))}
                                                    {index !== ingresos.length - 1 && <Divider my={4} />}
                                                </Box>
                                            ))}
                                        </>
                                    ) : (
                                        <Text textAlign="center">Esta bodega no posee ingresos</Text>
                                    )}
                                    <Button
                                        onClick={() => setIsOpen(true)} mt={4} colorScheme="teal">
                                        Crear Ingreso
                                    </Button>
                                </AccordionPanel>
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
                {modalCreate}

            </Box>


           
        </>

    );
};
export default ingresoPage;