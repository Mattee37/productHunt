import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import useProductos from "../hooks/useProductos";

import Layout from "../components/layout/Layout";
import ProductDetails from "../components/layout/ProductDetails";

const Buscar = () => {
  //asigna el router
  const router = useRouter();

  //desestructura el query que nos trae el componente SearchBox dentro del router
  const {
    query: { q }
  } = router;

  //desestrcutura desde el hook
  const { productos } = useProductos("creado");
  //[estado, actualziador]
  const [resultado, setResultado] = useState([]);

  //genera la busqueda aplicando los filtros deseados
  useEffect(() => {
    //transforma el query en lowerCase y lo asigna
    const busqueda = q.toLowerCase();
    //filtra la busqueda entre los nombres y la descripcion de los productos
    const filtro = productos.filter(producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    setResultado(filtro);
  }, [q, productos]);

  return (
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {resultado.map(producto => (
              <ProductDetails key={producto.id} producto={producto} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Buscar;
