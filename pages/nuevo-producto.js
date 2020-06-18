import React, { Fragment, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import { css } from "@emotion/core";

import Layout from "../components/layout/Layout";

import { Form, Camp, InputSubmit, Error } from "../components/ui/Form";
import ErrorC from "../components/layout/ErrorC";

import { FirebaseContext } from "../firebase";

import FileUploader from "react-firebase-file-uploader";

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: ""
};

const NuevoProducto = () => {
  //[estado, actualizador]
  const [nombreimagen, setNombreImagen] = useState("");
  //[estado, actualizador]
  const [subiendo, setSubiendo] = useState(false);
  //[estado, actualizador]
  const [progreso, setProgreso] = useState(0);
  //[estado, actualizador]
  const [urlImagen, setUrlImagen] = useState("");
  //[estado, actualizador]
  const [error, setError] = useState(false);

  //desestructuramos desde el hook
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  //desestructuramos desde la constante
  const { nombre, empresa, url, descripcion } = valores;

  //asignamos el router
  const router = useRouter();

  //desestrcuturamos desde el context de Firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  // crea el producto
  async function crearProducto() {
    //si no hay usuario loggeado, nos cambia la vista hacia el login
    if (!usuario) {
      return router.push("/login");
    }

    // crea el objeto de producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    };

    //añade en producto a la DB
    firebase.db.collection("productos").add(producto);

    //nos devuelve al root
    return router.push("/");
  }

  // comienzo del progreso de subida de imagen
  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  //setea el progreso
  const handleProgress = progreso => setProgreso({ progreso });

  //muestra el error de progreso, si es que existe
  const handleUploadError = error => {
    setSubiendo(error);
    console.error(error);
  };

  //sube el archivo a firebase/storage
  const handleUploadSuccess = nombre => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        setUrlImagen(url);
      });
  };
  return (
    <div>
      <Layout>
        {!usuario ? (
          <ErrorC texto="Registrese para ver esta sección!" />
        ) : (
          <Fragment>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo producto
            </h1>
            <Form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Informacion general</legend>

                <Camp>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="nombre"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Camp>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Camp>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Tu empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Camp>
                {errores.empresa && <Error>{errores.empresa}</Error>}
                <Camp>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Camp>
                <Camp>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL del producto"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Camp>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu producto</legend>
                <Camp>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Camp>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}
              <InputSubmit type="submit" value="Crear producto" />
            </Form>
          </Fragment>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
