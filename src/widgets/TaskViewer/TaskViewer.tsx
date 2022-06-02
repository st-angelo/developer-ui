import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../features/socketWrapper';
import { Events } from './events';
import IssueDto from './issueDto';

interface TaskViewerProps {}

const TaskViewer: React.FC<TaskViewerProps> = () => {
  const [issues, setIssues] = useState<IssueDto[]>([]);

  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const issueListener = (response: IssueDto) =>
      setIssues(prev => {
        const newIssues = prev.filter(issue => issue.id !== response.id);
        newIssues.push(response);
        return newIssues.sort((x, y) => y.priority - x.priority);
      });

    socket.on(Events.Issue, issueListener);
    socket.emit(Events.GetIssues, { route: '/test/:id' });

    return () => {
      socket.off(Events.Issue, issueListener);
    };
  }, [socket]);

  return (
    <Grid>
      {issues &&
        issues.map(issue => (
          <div
            key={issue.id}
            style={{
              border: '2px solid white',
              borderRadius: '10px',
              padding: '15px',
              marginBlock: '15px',
            }}
          >
            <h1>Issue: {issue.name}</h1>
            <p>Status: {issue.status}</p>
          </div>
        ))}
    </Grid>
  );
};

export default TaskViewer;
