import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QAManagerRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo && (userInfo.role.name === 'QA Manager')
      ? <Outlet /> 
      : <Navigate to='/login' replace />;
  };

export default QAManagerRoute