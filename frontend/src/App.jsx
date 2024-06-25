import React from "react";
import ShortenForm from "./Components/Molecules/ShortenForm";
import "./styles/input.css"; // Importa los estilos de Tailwind

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <ShortenForm />
    </div>
  );
}

export default App;