interface IssueDto {
  id: number;
  key: string;
  name: string;
  status: string;
  asignee: string;
  priority: number;
}

export default IssueDto;
