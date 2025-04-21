export interface AuthContextType {
  user: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  logout: () => void;
  refetchUser: () => Promise<void>;
}
