import { useNavigate } from 'react-router';

export const useCloseModal = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return closeModal;
};
