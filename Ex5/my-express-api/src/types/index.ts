export interface User {
  id: number;
  name: string;
}

export interface QueryOptions {
  page: number;
  limit: number;
  name?: string;
}