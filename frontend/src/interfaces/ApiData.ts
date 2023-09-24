export interface ResData {
  status: string;
  message: string;
  token: string;
  profile: {
    username: string;
    email: string;
    role: string;
  };
}
export interface ResEditUser {
  status: string;
  message: string;
  user: {
    username: string;
    email: string;
    role: string;
  };
}
