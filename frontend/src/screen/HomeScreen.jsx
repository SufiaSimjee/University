import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import Pusher from "pusher-js";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [pusherInstance, setPusherInstance] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (selectedDepartment) {
      if (!pusherInstance) {
        const pusher = new Pusher("d515d193601eae0c654b", {
          cluster: "mt1",
        });
        setPusherInstance(pusher);
      }

      const newChannel = pusherInstance?.subscribe(`department-idea-${selectedDepartment}`);
      setChannel(newChannel);

      newChannel?.bind("new-idea", (data) => {
        console.log("New Idea in department:", data);
      });

      return () => {
        if (newChannel) {
          newChannel.unbind_all();
          newChannel.unsubscribe();
        }
      };
    }
  }, [selectedDepartment, pusherInstance]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "An error occurred");
    }
  };

  const handleJoin = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    navigate(`/department/${selectedDepartment}/ideas`);
  };

  return (
    <>
      <h1>University Innovation and Improvement Hub</h1>
      <h2>ddd</h2>
      {userInfo ? (
        <div>
          <h3>Welcome {userInfo.fullName}</h3>

          <label htmlFor="department">Department:</label>
          <select
            id="department"
            className="form-control"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select a Department</option>
            {userInfo.departments && userInfo.departments.length > 0 ? (
              userInfo.departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))
            ) : (
              <option value="">No departments available</option>
            )}
          </select>

          <Button className="mt-2" onClick={handleJoin}>
            Join Department Idea Channel
          </Button>

          <br />

          <Button className="mt-2" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      ) : (
        <>
          <Button as={Link} to="/login">
            Login
          </Button>
        </>
      )}
    </>
  );
};

export default HomeScreen;
