import { useNavigate, useLocation } from 'react-router';

export default function useCloseModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => {
    // Si tenemos una ubicación anterior en el estado, volvemos a ella
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation.pathname);
    } else {
      // Si no hay ubicación anterior, simplemente volvemos atrás
      navigate(-1);
    }
  };

  return closeModal;
} 