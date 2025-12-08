export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResponseBody {
  id: string;
  username: string;
  token: string;
  role: string;
}
