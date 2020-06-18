export default function validarCrearCuenta(valores) {
  //crea la variable
  let errores = {};

  //valida error en nombre
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  //valida error en empres
  if (!valores.empresa) {
    errores.empresa = "La empresa es obligatoria";
  }

  //valida errores en url
  if (!valores.url) {
    errores.url = "La URL del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL no válida";
  }

  //valida error en la descripcion
  if (!valores.descripcion) {
    errores.descripcion = "La descripcion del producto es obligatoria";
  }

  return errores;
}
