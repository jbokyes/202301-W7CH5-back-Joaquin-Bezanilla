export type User = {
  id: string;
  email: string;
  passwd: string;
  friends?: User[];
  enemies?: User[];
};
