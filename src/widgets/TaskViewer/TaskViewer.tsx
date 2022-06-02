/* TaskViewer widget
 * In development...
 */
import { Grid, Link, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import sortBy from 'lodash.sortby';
import React, { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '../../features/socketWrapper';
import { DeletedIssueResponse, IssueDto, IssueXRouteResponse } from './dtos';
import { Events } from './events';
import styles from './styles';

interface Issue {
  issueXRouteId: string;
  route: string;
  issue: IssueDto;
}

const useStyles = makeStyles(styles);

interface TaskViewerProps {}

const TaskViewer: React.FC<TaskViewerProps> = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const classes = useStyles();

  const socket = useSocketContext();

  const handleDelete = useCallback(
    (id: string) => {
      if (!socket) return;
      socket.emit(Events.DeleteIssue, { id });
    },
    [socket]
  );

  useEffect(() => {
    if (!socket) return;

    const issueXRoute = (response: IssueXRouteResponse) =>
      setIssues(prev => {
        const newIssues = prev.filter(
          issue => issue.issueXRouteId !== response.id
        );
        newIssues.push({
          issueXRouteId: response.id,
          route: response.route,
          issue: response.issue,
        });
        return sortBy(newIssues, ['priority', 'name']);
      });

    const deletedIssue = (response: DeletedIssueResponse) =>
      setIssues(prev =>
        prev.filter(issue => issue.issueXRouteId !== response.id)
      );

    socket.on(Events.IssueXRoute, issueXRoute);
    socket.on(Events.DeletedIssue, deletedIssue);

    socket.emit(Events.GetIssues, { route: '/test/:id' });

    return () => {
      socket.off(Events.IssueXRoute, issueXRoute);
      socket.off(Events.DeletedIssue, deletedIssue);
    };
  }, [socket]);

  return (
    <Grid>
      {issues &&
        issues.map(({ issue }) => (
          <div className={classes.card} key={issue.id}>
            <div
              className={classes.exit}
              onClick={() => handleDelete(issue.id)}
            >
              <Delete />
            </div>
            <div className={classes.title}>
              <Link />{' '}
              <span>
                {issue.key}: {issue.name}
              </span>
            </div>
            <div className={classes.summary}>
              <div>
                <img
                  className={classes.icon}
                  src={issue.typeIconUrl}
                  alt="..."
                />{' '}
                <span className={classes.bold}>{issue.type}</span>
              </div>
              <span>{issue.description}</span>
            </div>
            <div>
              <div className={classes.statStart}>
                <span className={classes.bold}>Status:</span>{' '}
                <span className={classes.bullet}>{issue.status}</span>
              </div>
              <div className={classes.statEnd}>
                <span className={classes.bold}>Priority:</span>{' '}
                <span className={classes.bullet}>
                  <img
                    className={classes.icon}
                    src={issue.priorityIconUrl}
                    alt="..."
                  />{' '}
                  {issue.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
    </Grid>
  );
};

export default TaskViewer;
