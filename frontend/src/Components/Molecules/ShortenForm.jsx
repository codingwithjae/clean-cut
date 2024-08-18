import React from 'react';
import Input from '../Atoms/Input';
import Button from '../Atoms/Button';
import useInputValidation from '../../hooks/inputValidation';

export default function ShortenForm() {
  // Usamos el hook para manejar toda la lógica
  const { url, setUrl, handleSubmit } = useInputValidation(validUrl => {
    console.log('URL enviada:', validUrl);
    // Aquí puedes realizar la lógica para enviar la URL al backend
  });

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-10">
      <div
        className="
          flex 
          flex-col 
          items-center 
          gap-4 
          justify-center 
          md:flex-row
        "
      >
        {/* Input controlado */}
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter a link to be shortened" />
        <Button type="submit" text="Shorten link" />
      </div>
    </form>
  );
}
