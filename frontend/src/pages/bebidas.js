import { useState, useEffect } from "react";
import axios from "axios";
import { getBebidas } from "../pages/api/bebida";


const bebidaPage = () => {
  const [bebidas, setBebidas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const bebidas = await getBebidas();
            setBebidas(bebidas);
        };
        fetchData();
    }, []);

  const renderBebidas = () => {
    return bebidas.map((bebida) => {
      return (
        <div key={bebidas.id}>
          <h3>{bebida.nombre}</h3>
        </div>
      );
    });
  };

  return (
    <div>
          <h1>holaa</h1>

      <h1>Bebidas</h1>
      {renderBebidas()}
    </div>
  );
};

export default bebidaPage;