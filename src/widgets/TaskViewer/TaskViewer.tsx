import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import withSocketWrapper, {
  SocketWrapperProps,
} from '../../features/socketWrapper';
import { Events } from './events';

interface TaskViewerProps extends SocketWrapperProps {}

const TaskViewer: React.FC<TaskViewerProps> = ({ socket }: TaskViewerProps) => {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (!socket) return;

    const messageListener = (response: string) => setMessage(response);

    socket.on(Events.MESSAGE, messageListener);
    socket.emit(Events.GET_MESSAGE);

    return () => {
      socket.off(Events.MESSAGE, messageListener);
    };
  }, [socket]);

  return (
    <Grid>
      <span>The message is: {message}</span>
    </Grid>
  );
};

export default withSocketWrapper(TaskViewer);
