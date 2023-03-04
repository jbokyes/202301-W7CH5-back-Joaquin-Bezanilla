export interface UserRepo<U> {
  query(): Promise<U[]>;
  queryId(_id: string): Promise<U>;
}
