export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  friends?: User[];
  enemies?: User[];
};
