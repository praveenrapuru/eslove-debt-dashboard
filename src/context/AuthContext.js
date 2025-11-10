import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const mockUsers = [
  { email: "admin@demo.com", password: "admin", role: "ADMIN", name: "Admin User" },
  { email: "agent@demo.com", password: "agent", role: "AGENT", name: "Agent User" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (email, password) => {
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");

    const fakeToken = btoa(JSON.stringify({ email, role: found.role })); // Mock JWT
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", JSON.stringify(found));
    setUser(found);
    setToken(fakeToken);
    return found; // Return user object for role-based navigation
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
