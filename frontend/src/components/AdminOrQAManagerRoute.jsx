import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminOrQAManagerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && (userInfo.role === 'Admin' || userInfo.role === 'QA Manager') 
    ? <Outlet /> 
    : <Navigate to='/login' replace />;
};

export default AdminOrQAManagerRoute;
