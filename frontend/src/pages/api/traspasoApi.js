import axios from "axios";


export const createTraspaso = async (id_bodega_origen, id_bodega_destino, guia, productos) => {
    console.log("id_bodega_origen", id_bodega_origen);
    console.log("id_bodega_destino", id_bodega_destino);
    console.log("guia", guia);
    console.log("productos", productos);


    const response = await axios.post("http://127.0.0.1:8000/api/traspaso/traspasarStock", {
        
        id_bodega_origen: id_bodega_origen,
        id_bodega_destino: id_bodega_destino,
        guia: guia,
        productos: productos,
    });
    return response.data.data;
}



export const getTraspasoBodega = async (id_bodega_origen) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/traspaso/viewOrigen', {
        params: {
          id_bodega_origen: id_bodega_origen,
        }
      });
      return response.data.traspasos;
    } catch (error) {
      console.log('Error al obtener los traspasos:', error);
      return null;
    }
  };