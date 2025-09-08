export interface AuthUser {
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  userName: string;
  email: string;
  jwtToken: string;
  role: string;
}
