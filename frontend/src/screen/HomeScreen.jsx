import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <h1>University Innovation and Improvement Hub</h1>
      {userInfo ? (
        <div>
          <h2>Welcome {userInfo.name}</h2>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      ) : null}
    </>
  );
};

export default HomeScreen;
