import React, { createContext, useState, useEffect } from 'react';
import api from './api';  

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data);
        localStorage.setItem('loggedInUser', JSON.stringify(res.data));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  // Function to update user state
  const updateUser = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('loggedInUser', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}