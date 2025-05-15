import axios from 'axios';

// تسجيل مستخدم جديد
export const register = async (userData) => {
  const response = await axios.post('http://localhost:8000/api/auth/register', userData, { withCredentials: true });
  return response.data;
};

// تسجيل الدخول
export const login = async (userData) => {
  const response = await axios.post('/api/auth/login', userData, { withCredentials: true });
  return response.data;
};

// استرجاع بيانات المستخدم الحالي
export const getMe = async () => {
  const response = await axios.get('/api/auth/me', { withCredentials: true });
  return response.data;
};

// تسجيل الخروج
// export const logout = async () => {
//   const response = await axios.post('/api/auth/logout', {}, { withCredentials: true });
//   return response.data;
// };
export const logout = async () => {
  const response = await axios.post('http://localhost:8000/api/auth/logout', {}, { 
    withCredentials: true 
  });
  return response.data;
};
