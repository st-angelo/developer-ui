import { Close } from '@material-ui/icons';
import { CSSTransition } from 'react-transition-group';
import './Popover.css';

interface PopoverProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Popover = ({ open, onClose, children }: PopoverProps) => {
  return (
    <CSSTransition
      in={open}
      timeout={200}
      classNames={'popover'}
      mountOnEnter
      unmountOnExit
      appear
    >
      <div className='fixed bottom-5 right-5 m-5 flex aspect-[1/1.3] w-96 flex-col overflow-hidden rounded-lg shadow-md shadow-gray-300'>
        <div className='flex h-10 items-center justify-end bg-lime-500 px-2 text-white'>
          <Close className={'cursor-pointer'} onClick={onClose} />
        </div>
        <div>{children}</div>
      </div>
    </CSSTransition>
  );
};

export default Popover;
