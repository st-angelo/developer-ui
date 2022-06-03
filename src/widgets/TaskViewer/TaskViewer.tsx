/* TaskViewer widget
 * In development...
 */
import {
  Button,
  Fade,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  TextField,
} from '@material-ui/core';
import { Add, Delete, Forum, Link } from '@material-ui/icons';
import sortBy from 'lodash.sortby';
import React, { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '../../features/socketWrapper';
import { IssueDeletedResponse, IssueDto } from './dtos';
import { Events } from './events';
import styles from './styles';

const useStyles = makeStyles(styles);

interface TaskViewerProps {}

const TaskViewer: React.FC<TaskViewerProps> = () => {
  const [issues, setIssues] = useState<IssueDto[]>([]);
  const [addPopperOpen, setAddPopperOpen] = useState(false);
  const [keyAdd, setKeyAdd] = useState('');
  const [routeAdd, setRouteAdd] = useState('');
  const classes = useStyles();
  // TODO implement route pattern fetching
  const routePattern = '/test/:id';

  const socket = useSocketContext();

  const handleAdd = useCallback(() => {
    if (!socket) return;
    socket.emit(Events.AddIssue, {
      issueKey: keyAdd,
      route: routeAdd,
    });
  }, [keyAdd, routeAdd]);

  const handleDelete = useCallback(
    (issueKey: string, route: string) => {
      if (!socket) return;
      socket.emit(Events.DeleteIssue, { issueKey, route });
    },
    [socket]
  );

  useEffect(() => {
    if (!socket) return;

    const issueHandler = (response: IssueDto) => {
      if (response.route && response.route !== routePattern) return;
      setIssues(prev => {
        const newIssues = prev.filter(issue => issue.key !== response.key);
        newIssues.push({ ...response, route: routePattern });
        return sortBy(newIssues, ['priority', 'name']);
      });
    };

    const issueDeletedHandler = (response: IssueDeletedResponse) => {
      if (response.route !== routePattern) return;
      setIssues(prev => prev.filter(issue => issue.key !== response.issueKey));
    };

    socket.on(Events.Issue, issueHandler);
    socket.on(Events.IssueDeleted, issueDeletedHandler);

    socket.emit(Events.GetIssues, { route: routePattern });

    return () => {
      socket.off(Events.Issue, issueHandler);
      socket.off(Events.IssueDeleted, issueDeletedHandler);
    };
  }, [socket]);

  console.log(issues);

  // TODO: Implement the actual UI; below is just a test
  return (
    <>
      {issues &&
        issues.map(issue => (
          <div className={classes.card} key={issue.id}>
            <span
              className={classes.exit}
              onClick={() => handleDelete(issue.key, routePattern)}
            >
              <Delete />
            </span>
            <div className={classes.key}>
              <Link /> <span>{issue.key}</span>
            </div>
            <div className={classes.name}>
              <span>{issue.name}</span>
            </div>
            <div className={`${classes.centered} ${classes.summary}`}>
              <span className={classes.label}>Issue type:</span>
              <img
                className={classes.icon}
                src={issue.typeIconUrl}
                alt="..."
              />{' '}
              <span className={`${classes.bold} ${classes.value}`}>
                {issue.type}
              </span>
            </div>
            <div className={classes.stats}>
              <div className={classes.statStart}>
                <span className={classes.label}>Status:</span>
                <span className={classes.bullet}>{issue.status}</span>
              </div>
              <div className={classes.statEnd}>
                <span className={classes.label}>Priority:</span>
                <span className={classes.value}>
                  <img
                    className={classes.icon}
                    src={issue.priorityIconUrl}
                    alt="..."
                  />
                  <em>{issue.priorityName}</em>
                </span>
              </div>
            </div>
            <a
              className={classes.assigneeLinkWrapper}
              target="_blank"
              href={`https://teams.microsoft.com/l/chat/0/0?users=${issue.assigneeEmail}`}
            >
              <div className={classes.assigneeContainer}>
                <span className={classes.label}>Assignee:</span>
                <img
                  className={classes.avatar}
                  src={issue.assigneeAvatarUrl}
                  alt="..."
                />
                <span className={classes.bold}>{issue.assigneeName}</span>
                <Forum />
              </div>
            </a>
          </div>
        ))}
      <Popper open={addPopperOpen} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.addPaper}>
              <TextField
                id={'key'}
                value={keyAdd}
                onChange={e => setKeyAdd(e.target.value)}
              />
              <TextField
                id={'route'}
                value={routeAdd}
                onChange={e => setRouteAdd(e.target.value)}
              />
              <Button color={'primary'} onClick={handleAdd}>
                Add
              </Button>
              <Button
                color={'secondary'}
                onClick={() => setAddPopperOpen(false)}
              >
                Cancel
              </Button>
            </Paper>
          </Fade>
        )}
      </Popper>
      <IconButton
        color={'primary'}
        className={classes.add}
        onClick={() => setAddPopperOpen(prev => !prev)}
      >
        <Add />
      </IconButton>
    </>
  );
};

export default TaskViewer;
