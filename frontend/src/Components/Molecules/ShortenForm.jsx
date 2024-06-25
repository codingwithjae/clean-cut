import React, { useState } from 'react';
import Input from '../Atoms/Input';
import Button from '../Atoms/Button';

const ShortenForm = () => {
  const [url, setUrl] = useState(''); // Estado para la URL
  const [error, setError] = useState(''); // Estado para los errores

  const handleSubmit = e => {
    e.preventDefault();

    // Validar que la URL no esté vacía
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }

    // Validar que la URL tenga un formato válido
    try {
      new URL(url); // Esto lanza un error si la URL no es válida
    } catch {
      setError('The URL format is invalid.');
      return;
    }

    // Si la URL es válida, envíala al backend
    console.log('URL to shorten:', url);

    // Limpiar el campo de entrada y el error después de enviar
    setUrl('');
    setError('');
  };

  return (
    <section className="flex flex-col items-center justify-center p-4 rounded-lg w-auto">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter a link to be shortened" />
          <Button type="submit" text="Shorten link"></Button>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </form>
    </section>
  );
};

export default ShortenForm;
