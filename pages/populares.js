import React from "react";

import useProductos from "../hooks/useProductos";

import Layout from "../components/layout/Layout";
import ProductDetails from "../components/layout/ProductDetails";

const Populares = () => {
  // asigna a la constante los productos desde el hook
  const { productos } = useProductos("votos");

  return (
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {productos.map(producto => (
              <ProductDetails key={producto.id} producto={producto} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Populares;
