import axios from 'axios';

export const createTraspaso = async (id_bodega_origen, id_bodega_destino, guia,productos) => {
    const response = await axios.post("http://127.0.0.1:8000/api/traspaso/traspasarStock", {
        id_bodega_origen: id_bodega_origen,
        id_bodega_destino: id_bodega_destino,
        guia: guia,
        productos: productos,
    });
    return response.data.data;
}
