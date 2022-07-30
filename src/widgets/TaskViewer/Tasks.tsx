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
import { toast } from 'react-toastify';
import { useSocketContext } from '../../features/socketWrapper';

interface TasksProps {}

const Tasks: React.FC<TasksProps> = () => {
  const [issues, setIssues] = useState<IssueDto[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [keyAdd, setKeyAdd] = useState('');

  const routePattern = '/';

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
  
  return (
    <div className='flex flex-col p-2'>
      {issues.map(issue => (
        <span key={issue.id}>{issue.name}</span>
      ))}
      {issues.length === 0 && <span>There are no issues</span>}
    </div>
  );
};

export default Tasks;
