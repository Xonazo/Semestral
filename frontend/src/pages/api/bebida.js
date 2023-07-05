import axios from 'axios';

export const getBebidas = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/bebida/viewAll');
    return response.data.data;
    }
