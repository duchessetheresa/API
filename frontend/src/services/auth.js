import jwtDecode from 'jwt-decode';

export const login = (token, userType) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userType', userType);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch (error) {
    return false;
  }
};

export const isProfessional = () => {
  return localStorage.getItem('userType') === 'professionnel';
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};