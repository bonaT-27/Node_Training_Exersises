// types/auth.ts
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface JwtPayload {
  userId: number;
  role: string;
}