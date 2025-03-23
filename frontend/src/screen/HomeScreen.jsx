import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserGradientBox from "../components/UserGradientBox";
import QACGradientBox from "../components/QACGradientBox";
import DashboardScreen from "./DashboardScreen";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="container mt-4">
      <h1 className="mb-3">University Innovation and Improvement Hub</h1>

      {userInfo ? (
        <div>
          <h3>Welcome, {userInfo.fullName} 👋</h3>

          <p className="text-primary">
            {userInfo.lastLogin === "This is your first login!"
              ? userInfo.lastLogin
              : `Your last login was on ${new Date(userInfo.lastLogin).toLocaleString()}`}
          </p>

          {userInfo.role?.name === "Staff" ? <UserGradientBox /> : null}

          {userInfo.role?.name === "QA Coordinator" ? <QACGradientBox /> : null}

          {userInfo.role?.name === "Admin" || userInfo.role?.name === "QA Manager" ? (
            <DashboardScreen />
          ) : null}
        </div>
      ) : (
        <Button as={Link} to="/login" className="mt-3">
          Login
        </Button>
      )}
    </div>
  );
};

export default HomeScreen;
