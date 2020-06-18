import React, { useEffect, useState } from "react";

import firebase from "../firebase";

// hook que valida que estemos registrados
function useAutenticacion() {
  // [estado, actualizador]
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  // pone al usuario registrado dentro del estado
  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
      if (usuario) {
        setUsuarioAutenticado(usuario);
      } else {
        setUsuarioAutenticado(null);
      }
    });
    return () => unsuscribe();
  }, []);

  return usuarioAutenticado;
}

export default useAutenticacion;
