import axios from 'axios';


export const getStock = async (id_bodega) => {
    const response = await axios.get('http://127.0.0.1:8000/api/stock/view', {
        params: {
            id_bodega: id_bodega,
        }
    });
    return response.data.stock;

}



export const createEgreso = async (id_bodega,productos) => {
    const response = await axios.post("http://127.0.0.1:8000/api/stock/egreso", {
        id_bodega: id_bodega,
        productos: productos,
    });
    return response.data.data;
}

