import React, { Fragment, useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";

import SearchBox from "../ui/SearchBox";
import Nav from "./Nav";

import Button from "../ui/Button";

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;

  &:hover {
    cursor: pointer;
  }
`;

const Header = () => {
  // asigna a las constantes usuario y firebase desde el context de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContenedorHeader>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <SearchBox />
          <Nav />
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {usuario ? (
            <Fragment>
              <p
                css={css`
                  margin-right: 2rem;
                `}
              >
                Hola: {usuario.displayName}
              </p>
              <Button bgColor="true" onClick={() => firebase.cerrarSesion()}>
                Cerrar sesion
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Link href="/login">
                <Button bgColor="true">Login</Button>
              </Link>
              <Link href="/crear-cuenta">
                <Button>Crear cuenta</Button>
              </Link>
            </Fragment>
          )}
        </div>
      </ContenedorHeader>
    </header>
  );
};

export default Header;
