export interface AuthUser {
  username: string;
  email: string;
}

export interface AuthResponse {
  userName: string;
  email: string;
  jwtToken: string;
}
