import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Router from "next/router";

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;

  &:hover {
    cursor: pointer;
  }
`;

const SearchBox = () => {
  // [estado, actualizador]
  const [busqueda, setBusqueda] = useState("");

  //previene el estado por defualt del form, valida y pasa tanto datos como la vista hacia la ruta buscar
  const buscarProducto = e => {
    e.preventDefault();

    //valida
    if (busqueda.trim() === "") return;

    //envia la vista hacia el pathname y le pasa un query.
    Router.push({ pathname: "/buscar", query: { q: busqueda } });
  };

  return (
    <form
      css={css`
        position: relative;
      `}
      onSubmit={buscarProducto}
    >
      <InputText
        type="text"
        placeholder="Buscar productos"
        onChange={e => setBusqueda(e.target.value)}
      />
      <InputSubmit type="submit">Buscar</InputSubmit>
    </form>
  );
};

export default SearchBox;
