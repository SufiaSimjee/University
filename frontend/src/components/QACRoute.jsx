import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const QACRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo && (userInfo.role.name === 'QA Coordinator')
      ? <Outlet /> 
      : <Navigate to='/login' replace />;
  };

export default QACRoute