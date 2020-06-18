import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../firebase";

//devuelve los productos dependiendo del filtro deseado
const UseProductos = orden => {
  //[estado, actualziador]
  const [productos, setProductos] = useState([]);

  // asigna a la constante firebase desde le contexto
  const { firebase } = useContext(FirebaseContext);

  // trae todos los productos desde la DB dependiendo del filtro
  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db
        .collection("productos")
        .orderBy(orden, "desc")
        .onSnapshot(manejarSnapshot);
    };
    obtenerProductos();
  }, []);

  // mapea y guarda los productos en el estado
  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setProductos(productos);
  }

  return {
    productos
  };
};

export default UseProductos;
