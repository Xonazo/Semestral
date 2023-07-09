import axios from 'axios';

export const getBodegas = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/bodega/viewAll');
    return response.data.data;

}


export const deleteBodega = async (id) => {
    const response = await axios.delete("http://127.0.0.1:8000/api/bodega/delete",
        {
            data: { id: id },
        });
    return response.data.data;
};

export const updateBodega = async (id, nombre) => {
    const response = await axios.put("http://127.0.0.1:8000/api/bodega/update", {
        id: id,
        nombre: nombre,
    });
    return response.data.data;
};


export const createBodega = async (nombre) => {
    const response = await axios.post("http://127.0.0.1:8000/api/bodega/create",{
        nombre: nombre,
    });
    return response.data.data;
    }