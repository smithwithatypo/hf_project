import React, { createContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from './api';  

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  function initializeSocketConnection(token) {
    socketRef.current = io('http://localhost:5001', {
      auth: {
        token,
      },
      reconnection: false, // Enable reconnection
    });

    socketRef.current.on('userUpdated', (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // if (reason === 'io server disconnect') {
      //   // Server disconnected the socket; the client needs to reconnect manually
      //   socketRef.current.connect();
      // }
    });
  }

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('UserProvider useEffect triggered');
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        api.defaults.headers.common['x-auth-token'] = token;

        try {
          const res = await api.get('/user');
          setUser(res.data);
          localStorage.setItem('loggedInUser', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser');
        }
      }
    };

    fetchUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Establish socket connection when user logs in
  useEffect(() => {
    if (user && !socketRef.current) {
      console.log('Establishing WebSocket connection...');
      const token = localStorage.getItem('token');
      if (token) {
        initializeSocketConnection(token);
      }
    } else if (!user && socketRef.current) {
      // User logged out, disconnect the socket
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [user]);

  // DEPRECATED: REMOVE Function to update user state
  const updateUser = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('loggedInUser', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout, socketRef, initializeSocketConnection }}>
      {children}
    </UserContext.Provider>
  );
}