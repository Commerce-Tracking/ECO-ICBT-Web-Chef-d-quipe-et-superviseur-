import { createContext, useContext } from "react";

interface AuthContextType {
  userInfo: {
    role_id: number;
    [key: string]: any;
  } | null;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
