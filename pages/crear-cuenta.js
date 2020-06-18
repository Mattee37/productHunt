import React, { Fragment, useState } from "react";
import Router from "next/router";
import { css } from "@emotion/core";

import Layout from "../components/layout/Layout";

import { Form, Camp, InputSubmit, Error } from "../components/ui/Form";

import firebase from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

//crea el state en bruto
const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: ""
};

const CrearCuenta = () => {
  //[estado, actualizador]
  const [error, setError] = useState(false);

  //desestructura desde el hook de validacion
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  //desestructura desde la constante valores
  const { nombre, email, password } = valores;

  //crea una nueva cuenta usando la funcion del objeto firebase
  async function crearCuenta() {
    try {
      //registra las credenciales
      await firebase.registrar(nombre, email, password);
      //cambia de vista
      Router.push("/");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Crear Cuenta
        </h1>
        <Form onSubmit={handleSubmit} noValidate>
          <Camp>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="nombre"
              id="nombre"
              placeholder="Tu Nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Camp>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Camp>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Tu Email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Camp>
          {errores.email && <Error>{errores.email}</Error>}
          <Camp>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Tu Password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Camp>
          {errores.password && <Error>{errores.password}</Error>}

          {error && <Error>{error}</Error>}
          <InputSubmit type="submit" value="Crear cuenta" />
        </Form>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
