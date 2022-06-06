export interface IssueExistsResponse {
  issueKey: string;
  route: string;
}

export interface IssueDeletedResponse {
  issueKey: string;
  route?: string;
}

export interface IssueNotFoundResponse {
  issueKey: string;
  route: string;
}

export interface IssueInvalidResponse {
  issueKey: string;
  errorMessages: string[];
}

export interface IssueIsCompletedResponse {
  issueKey: string;
}

export interface IssueDto {
  id: string;
  key: string;
  route?: string;
  url: string;
  name: string;
  type: string;
  typeDescription: string;
  typeIconUrl: string;
  status: string;
  statusDescription: string;
  priority: number;
  priorityName: string;
  priorityIconUrl: string;
  assigneeName: string;
  assigneeEmail: string;
  assigneeAvatarUrl: string;
}
