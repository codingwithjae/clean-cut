import { useNavigate } from 'react-router';

export default function useCloseModal() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return closeModal;
}
