import axios from "axios";


export const getIngresoBodega = async (id_bodega) => {
    const response = await axios.get('http://127.0.0.1:8000/api/ingreso/viewPorBodega', {
        params: {
            id_bodega: id_bodega,
        }
    });
    return response.data.ingresos;
};


export const createIngresoBodega = async (id_bodega, guia, detalles) => {
    const response = await axios.post("http://127.0.0.1:8000/api/ingreso/create", {
        id_bodega: id_bodega,
        guia: guia,
        detalles: detalles,
    });
    return response.data.data;
}