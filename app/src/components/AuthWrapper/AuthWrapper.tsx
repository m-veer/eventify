// components/AuthWrapper.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      // Get stored auth data from localStorage or cookies
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Validate token with backend if needed
          dispatch(setUser(userData));
        } catch (error) {
          localStorage.removeItem('user');
          if (!location.pathname.startsWith('/admin')) {
            navigate('/');
          }
        }
      } else if (location.pathname.startsWith('/admin')) {
        navigate('/');
      }
    };

    checkAuth();
  }, [dispatch, navigate, location]);

  return <>{children}</>;
};

export default AuthWrapper;