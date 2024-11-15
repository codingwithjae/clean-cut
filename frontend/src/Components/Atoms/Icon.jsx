import { AiOutlineClose } from 'react-icons/ai';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiCopy, FiEdit, FiExternalLink, FiTrash2, FiPlus } from 'react-icons/fi';

export default function Icon({ name, size = 24, isMenuOpen, className }) {
  const iconVariantes = {
    close: AiOutlineClose,
    menu: isMenuOpen ? FaTimes : FaBars,
    copy: FiCopy,
    edit: FiEdit,
    link: FiExternalLink,
    trash: FiTrash2,
    plus: FiPlus
  };

  const IconComponent = name && iconVariantes[name];

  if (!IconComponent) return null;

  return <IconComponent size={size} className={className} />;
}
