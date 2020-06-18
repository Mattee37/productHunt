import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  // [estado, valdiacion]
  const [valores, setValores] = useState(stateInicial);
  // [estado, valdiacion]
  const [errores, setErrores] = useState({});
  // [estado, valdiacion]
  const [submitForm, setSubmitForm] = useState(false);

  // valida que no haya ningun error y luego llama a la funcion correspondiente
  useEffect(() => {
    if (submitForm) {
      // valida errores
      const noErrores = Object.keys(errores).length === 0;

      //llama a la funcion
      if (noErrores) {
        fn();
      }
      setSubmitForm(false);
    }
  }, [errores]);

  // asigna a cada instancia del estado su respectivo valor
  const handleChange = e => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value
    });
  };

  // previene el actuar por defecto del form, valida los errores y manda a llamar el submit
  const handleSubmit = e => {
    ///previene
    e.preventDefault();
    //comprueba la existencia de errores
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    setSubmitForm(true);
  };

  // valida la existencia de errores al entrar en Blur
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  };
};

export default useValidacion;
