import axios from 'axios';

export const getBebidas = async () => {
  
    const response = await axios.get('http://127.0.0.1:8000/api/bebida/viewAll');
    return response.data.data;

};

export const deleteBebida = async (id) => {
    const response = await axios.delete("http://127.0.0.1:8000/api/bebida/delete", {
        data: { id: id },
    });
    return response.data.data;
};

export const updateBebida = async (id, nombre, formato) => {
    const response = await axios.put("http://127.0.0.1:8000/api/bebida/update", {
        id: id,
        nombre: nombre,
        formato: formato,
    });
    return response.data.data;
};

export const createBebida = async (nombre, formato) => {
    const response = await axios.post("http://127.0.0.1:8000/api/bebida/create", {
        nombre: nombre,
        formato: formato,
    });
    return response.data.data;
};


