export interface IssueXRouteResponse {
  id: string;
  route: string;
  issue: IssueDto;
}

export interface DeletedIssueResponse {
  id: string;
}

export interface IssueDto {
  id: string;
  key: string;
  name: string;
  description: string;
  type: string;
  typeDescription: string;
  typeIconUrl: string;
  status: string;
  statusDescription: string;
  priority: number;
  priorityIconUrl: string;
  assignee: string;
}
