import React, { useEffect, useContext, useState, Fragment } from "react";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";

import { FirebaseContext } from "../../firebase";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Layout from "../../components/layout/Layout";
import ErrorC from "../../components/layout/ErrorC";
import { Camp, InputSubmit } from "../../components/ui/Form";
import Button from "../../components/ui/Button";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Creador = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Product = () => {
  //[estado, actualizador]
  const [producto, setProducto] = useState({});
  //[estado, actualizador]
  const [error, setError] = useState(false);
  //[estado, actualizador]
  const [comentario, setComentario] = useState({});

  //asignamos el router
  const router = useRouter();
  //desestructuramos desde le query enviado desde el router
  const {
    query: { id },
  } = router;

  //desestructuramos desde el contexto
  const { firebase, usuario } = useContext(FirebaseContext);

  //extrae el producto de la id asignada
  useEffect(() => {
    //si existe el id
    if (id) {
      const obtenerProductos = async () => {
        //trae el producto segun el id
        const query = await firebase.db.collection("productos").doc(id);
        const producto = await query.get();
        //si existe el producto lo settea al state
        if (producto.exists) {
          setProducto(producto.data());
        } else {
          //settea el error
          setError(true);
        }
      };
      obtenerProductos();
    }
  }, [id, producto]);

  //si no hay producto o un error retorna un string en pantalla
  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  //desestructura desde producto
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //vota al producto
  const votarProducto = () => {
    //si existe el usuario
    if (!usuario) {
      //cambia de vista al login
      return router.push("/login");
    }

    //valor del voto
    const nuevoTotal = votos + 1;

    //si la id del usuario ya esta dentro de los votos, no lo permite volver a hacer
    if (haVotado.includes(usuario.uid)) return;

    //agrega el nuevo votante a la lista
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //actualiza la lista de votantes
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //actualiza el state del producto
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
  };

  //verifica si el usuario del mensaje es el creador
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  //actualiza los respectivos cambios dentro del comentario
  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //agre le comentario
  const agregarComentario = (e) => {
    //previene el estado por defualt del form
    e.preventDefault();

    //si no hay usuario loggeado, cambia a la vista de login
    if (!usuario) {
      return router.push("/login");
    }

    //agrega al objeto los nuevos campos
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //agrega los comentarios a la lista
    const nuevosComentarios = [...comentarios, comentario];

    //actualiza los comentarios en la DB
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    //actualiza los comentarios en el state
    setComentario({
      ...producto,
      comentarios: nuevosComentarios,
    });
  };

  //verifica si el usuario loggeado es el mismo que creo el producto
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  //elimina el producto
  const eliminarProducto = async () => {
    //de no estar loggeado, cambia la vista al login
    if (!usuario) {
      return router.push("/login");
    }

    //si el id del creador es distinto al del usuario loggeado cambia a la vista root
    if (creador.id !== usuario.uid) {
      return router.push("/");
    }

    try {
      //borra el producto segun el id
      await firebase.db.collection("productos").doc(id).delete();
      //nos cambia a la vista root
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {error ? (
        <ErrorC texto="No se ha encontrado ningun producto." />
      ) : (
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado hace:{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}
              </p>
              <p>
                Publicado por: {creador.nombre} de {empresa}
              </p>
              <img src={urlImagen} alt={nombre} />
              <p>{descripcion}</p>
              {usuario && (
                <Fragment>
                  <h2>Agrega un comentario!</h2>

                  <form onSubmit={agregarComentario}>
                    <Camp>
                      <input
                        type="text"
                        name="mensaje"
                        onChange={comentarioChange}
                      />
                    </Camp>
                    <InputSubmit type="submit" value="Agregar comentario" />
                  </form>
                </Fragment>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>
              {comentarios.length === 0 ? (
                "Aún no hay comentarios."
              ) : (
                <ul>
                  {comentarios.map((comentario, i) => (
                    <li
                      key={`${comentario.usuarioId}-${i}`}
                      css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                      `}
                    >
                      <p>{comentario.mensaje}</p>
                      <p>
                        Escrito por:{" "}
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {comentario.usuarioNombre}
                        </span>
                      </p>
                      {esCreador(comentario.usuarioId) && (
                        <Creador>Creador</Creador>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <aside>
              <Button target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Button>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} Votos
                </p>

                {usuario && <Button onClick={votarProducto}>Votar!</Button>}
              </div>
            </aside>
          </ContenedorProducto>
          {puedeBorrar() && (
            <Button onClick={eliminarProducto}>Eliminar producto</Button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Product;
