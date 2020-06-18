import React, { createContext } from "react";
import firebaseConfig from "./config";

//creamos el context como null
const firebaseContext = createContext(null);

export default firebaseContext;
