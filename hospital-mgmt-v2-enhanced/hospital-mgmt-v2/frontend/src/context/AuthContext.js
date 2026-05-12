import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, doctorLogin, patientLogin } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginAs = async (role, email, password) => {
    let res;
    if (role === 'admin') res = await adminLogin({ email, password });
    else if (role === 'doctor') res = await doctorLogin({ email, password });
    else res = await patientLogin({ email, password });

    const data = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
