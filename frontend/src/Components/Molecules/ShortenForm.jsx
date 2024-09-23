import Input from '../Atoms/Input';
import Button from '../Atoms/Button';
// import {handleUrl} from '../../hooks/useShortenValidations';

export default function ShortenForm() {
  return (
    <form className="w-full flex flex-col gap-4 mt-10">
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
        <Input placeholder="Enter a link to be shortened" />
        <Button type="submit" text="Shorten link" />
      </div>
    </form>
  );
}
