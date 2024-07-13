import { useState } from "react";
import { toast } from "react-toastify";

const useInputValidation = (onSubmit) => {
  const [url, setUrl] = useState(""); // Estado para la URL
  const [error, setError] = useState(""); // Estado para los errores

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que la URL no esté vacía
    if (!url) {
      const errorMessage = "Please enter a valid URL.";
      setError(errorMessage);
      toast.error(errorMessage); // Mostrar notificación de error
      return;
    }

    // Validar que la URL tenga un formato válido
    try {
      new URL(url); // Esto lanza un error si la URL no es válida
    } catch {
      const errorMessage = "The URL format is invalid.";
      setError(errorMessage);
      toast.error(errorMessage); // Mostrar notificación de error
      return;
    }

    // Si la URL es válida, ejecuta la función onSubmit
    onSubmit(url);
    toast.success("URL successfully submitted!"); // Mostrar notificación de éxito

    // Limpiar el campo de entrada y el error después de enviar
    setUrl("");
    setError("");
  };

  return {
    url,
    setUrl,
    error,
    handleSubmit, // Devuelve handleSubmit para usarlo en el componente
  };
};

export default useInputValidation;