import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminOrQAManagerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && (userInfo.role.name === 'Admin' || userInfo.role.name === 'QA Manager')
    ? <Outlet /> 
    : <Navigate to='/login' replace />;
};

export default AdminOrQAManagerRoute;
