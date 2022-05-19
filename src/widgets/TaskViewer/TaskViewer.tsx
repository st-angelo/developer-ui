import { Grid } from '@material-ui/core';
import withSocketWrapper, { SocketWrapperProps } from 'features/socketWrapper';
import React from 'react';

interface TaskViewerProps extends SocketWrapperProps {}

const TaskViewer: React.FC<TaskViewerProps> = ({ socket }: TaskViewerProps) => (
  <Grid />
);

export default withSocketWrapper(TaskViewer);
