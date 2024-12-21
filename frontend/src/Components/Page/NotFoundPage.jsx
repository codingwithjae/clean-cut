import { useNavigate } from 'react-router-dom'
import Button from '../Atoms/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-cerulean-blue-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-2">Página no encontrada</h2>
      <p className="text-gray-400 mb-6">La página que buscas no existe o fue movida.</p>
      <Button
        text="Volver al inicio"
        variant="normal"
        className="px-6 py-3"
        onClick={() => navigate('/')}
      />
    </section>
  )
} 