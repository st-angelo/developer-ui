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
import {
  IssueDeletedResponse,
  IssueDto,
  IssueExistsResponse,
  IssueInvalidResponse,
  IssueIsCompletedResponse,
  IssueNotFoundResponse,
} from 'developer-published-language/task-viewer/dtos';
import Events from 'developer-published-language/task-viewer/events';
import sortBy from 'lodash.sortby';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSocketContext } from '../../features/socketWrapper';
import styles from './styles';

const useStyles = makeStyles(styles);

interface TaskViewerProps {}

const TaskViewer: React.FC<TaskViewerProps> = () => {
  const [issues, setIssues] = useState<IssueDto[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [keyAdd, setKeyAdd] = useState('');
  const classes = useStyles();

  const { pathname: routePattern } = useLocation();

  const socket = useSocketContext();

  const handleAdd = useCallback(() => {
    if (!socket) return;
    socket.emit(Events.AddIssue, {
      issueKey: keyAdd,
      route: routePattern,
    });
  }, [keyAdd, routePattern]);

  const handleDelete = useCallback(
    (issueKey: string) => {
      if (!socket) return;
      socket.emit(Events.DeleteIssue, { issueKey, route: routePattern });
    },
    [socket, routePattern]
  );

  useEffect(() => {
    if (!socket) return;
    setIssues([]);
    socket.emit(Events.GetIssues, { route: routePattern });
  }, [socket, routePattern]);

  useEffect(() => {
    if (!socket) return;

    const issueHandler = (response: IssueDto) => {
      if (response.route && response.route !== routePattern) return;
      setIssues(prev => {
        const newIssues = [...prev];
        const currentIdx = newIssues.findIndex(
          issue => issue.key === response.key
        );
        if (currentIdx === -1) {
          if (!response.route) return newIssues;
        } else newIssues.splice(currentIdx, 1);
        newIssues.push({ ...response, route: routePattern });
        return sortBy(newIssues, ['priority', 'name']);
      });
    };

    const issueDeletedHandler = ({ issueKey, route }: IssueDeletedResponse) => {
      if (route && route !== routePattern) return;
      setIssues(prev => prev.filter(issue => issue.key !== issueKey));
    };

    const issueInvalidHandler = ({
      issueKey,
      errorMessages,
    }: IssueInvalidResponse) =>
      toast.warn(
        `Key '${issueKey}' could not be added. Error(s):\n${errorMessages.join(
          '\n'
        )}`
      );

    const issueNotFoundHandler = ({
      issueKey,
      route,
    }: IssueNotFoundResponse) => {
      if (route !== routePattern) return;
      toast.warn(
        `Key '${issueKey}' was not registered for this route '${route}'.`
      );
    };

    const issueExistsHandler = ({ issueKey, route }: IssueExistsResponse) => {
      if (route !== routePattern) return;
      toast.warn(
        `Key ${issueKey} is already registered for this route '${route}'.`
      );
    };

    const issueIsCompletedHandler = ({ issueKey }: IssueIsCompletedResponse) =>
      toast.warn(
        `Task with key '${issueKey}' is completed. Change the task's status to add it.`
      );

    socket.on(Events.Issue, issueHandler);
    socket.on(Events.IssueDeleted, issueDeletedHandler);
    socket.on(Events.IssueInvalid, issueInvalidHandler);
    socket.on(Events.IssueNotFound, issueNotFoundHandler);
    socket.on(Events.IssueExists, issueExistsHandler);
    socket.on(Events.IssueIsCompleted, issueIsCompletedHandler);

    return () => {
      socket.off(Events.Issue, issueHandler);
      socket.off(Events.IssueDeleted, issueDeletedHandler);
      socket.off(Events.IssueInvalid, issueInvalidHandler);
      socket.off(Events.IssueNotFound, issueNotFoundHandler);
      socket.off(Events.IssueExists, issueExistsHandler);
      socket.off(Events.IssueIsCompleted, issueIsCompletedHandler);
    };
  }, [socket, routePattern]);

  console.log(issues, routePattern);

  // TODO: Implement the actual UI; below is just a test
  return (
    <>
      {issues &&
        issues.map(issue => (
          <div className={classes.card} key={issue.id}>
            <span
              className={classes.exit}
              onClick={() => handleDelete(issue.key)}
            >
              <Delete />
            </span>
            <a
              href={issue.url}
              className={classes.key}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link /> <span>{issue.key}</span>
            </a>
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
              rel="noopener noreferrer"
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
      <Popper
        open={Boolean(anchorEl)}
        placement={'top-end'}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.addPaper}>
              <TextField
                id={'key'}
                label={'Issue key (e.g. ERPFINSFLO-123)'}
                value={keyAdd}
                onChange={e => setKeyAdd(e.target.value)}
              />
              <Button className={classes.addBtn} onClick={handleAdd}>
                Add
              </Button>
              <Button
                className={classes.cancelBtn}
                onClick={() => setAnchorEl(null)}
              >
                Cancel
              </Button>
            </Paper>
          </Fade>
        )}
      </Popper>
      <IconButton
        className={classes.add}
        onClick={ev => setAnchorEl(prev => (prev ? null : ev.currentTarget))}
      >
        <Add />
      </IconButton>
    </>
  );
};

export default TaskViewer;
