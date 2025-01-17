import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

const LoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          dispatch(setUser(userData));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return null; // Or return a loading spinner if preferred
  }

  return <>{children}</>;
};

export default LoadingWrapper