import React, { Fragment, useState } from "react";
import Router from "next/router";
import { css } from "@emotion/core";

import Layout from "../components/layout/Layout";

import { Form, Camp, InputSubmit, Error } from "../components/ui/Form";

import firebase from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarLogin from "../validacion/validarLogin";

// crea un state en bruto
const STATE_INICIAL = {
  email: "",
  password: ""
};

const Login = () => {
  //[estado, actualizador]
  const [error, setError] = useState(false);

  // asigna a las constantes desde el hook
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarLogin, iniciarSesion);

  //desestructura desde valores
  const { email, password } = valores;

  // inicia sesion
  async function iniciarSesion() {
    try {
      // utiliza la funcion dentro de la clase Firebase
      await firebase.login(email, password);
      //redirige hacia el directorio root
      Router.push("/");
    } catch (error) {
      console.error(error);
      //setea el error
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
          Login
        </h1>
        <Form onSubmit={handleSubmit} noValidate>
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
          <InputSubmit type="submit" value="Login" />
        </Form>
      </Layout>
    </div>
  );
};

export default Login;
