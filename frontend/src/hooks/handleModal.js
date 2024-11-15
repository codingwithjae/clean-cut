import { useNavigate } from 'react-router';

export default function useCloseModal() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return handleClick;
}
