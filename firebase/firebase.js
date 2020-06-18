import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import firebaseConfig from "./config";

//creamos la clase Firebase, en donde van a alojarse todas nuestras llamadas a la DB, tanto propias como personalizadas.
class Firebase {
  constructor() {
    // de no existir una app, es creada
    if (app.apps.length === 0) {
      app.initializeApp(firebaseConfig);
    }

    //asigna funciones de firebase a la clase
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  // registra un usuario
  async registrar(nombre, email, password) {
    //lo crea dentro de firebase
    const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    // agrega el nombre por medio de una funcion
    return await nuevoUsuario.user.updateProfile({
      displayName: nombre
    });
  }

  // loggea con las credenciales
  async login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  //cierra la sesion
  async cerrarSesion() {
    await this.auth.signOut();
  }
}

//crea un objeto de la clase
const firebase = new Firebase();

export default firebase;
