import { ListAlt } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import Tasks from './Tasks';
import FloatingActionButton from '../../components/FloatingActionButton';
import Popover from '../../components/Popover';

interface AnchorProps {}

const Anchor: React.FC<AnchorProps> = () => {
  const [open, setOpen] = useState(false);

  const toggleTaskViewer = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <>
      {!open && (
        <FloatingActionButton icon={ListAlt} onClick={toggleTaskViewer} />
      )}
      <Popover open={open} onClose={toggleTaskViewer}>
        <Tasks />
      </Popover>
    </>
  );
};

export default Anchor;
