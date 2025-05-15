// import { createContext, useContext, useEffect, useState } from 'react';
// import { getMe, logout as apiLogout } from '../services/authService';
// import { useCookies } from 'react-cookie';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cookies , removeCookie] = useCookies(['token']);

//   const fetchUser = async () => {
//     try {
//       if (cookies.token) {
//         const res = await getMe();
//         setUser(res.user);
//         console.log(res.user)
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiLogout();
//       removeCookie('token', { path: '/' });
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [cookies.token]);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       loading, 
//       logout,
//       refetchUser: fetchUser // إضافة هذه الدالة للتحديث اليدوي
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getMe, logout as logoutService, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMe();
      setUser(data.user || null); // تأكد من أن data.user موجود
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      await checkAuth(); // لتحديث حالة المستخدم بعد التسجيل
      return response;
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout,
      register,
      updateUser,
      refetchUser: checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};