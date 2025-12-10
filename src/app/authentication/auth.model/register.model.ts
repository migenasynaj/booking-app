export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  id: string | null;
  username: string;
  token: string;
  role: string | null;
  email?: string;
}
