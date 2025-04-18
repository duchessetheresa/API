import { isAuthenticated } from './services/auth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const ProfessionalRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const isProf = isAuth && localStorage.getItem('userType') === 'professionnel';
  
  return isProf ? children : <Navigate to={isAuth ? '/' : '/login'} />;
};

export { ProfessionalRoute };
export default PrivateRoute;