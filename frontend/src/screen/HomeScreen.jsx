import { Button } from "react-bootstrap";
import {Link} from "react-router-dom"
import { useSelector } from "react-redux";
import GetNumberOfIdeaByDepartment from "../components/GetNumberOfIdeaByDepartment";
import GetNumberOfIdeaByPercentage from "../components/GetNumberOfIdeaByPercentage";
import GetContributorsByDepartment from "../components/GetContributorsByDepartment";
import GetAnonymousIdeasAndComments from "../components/GetAnonymousIdeasAndComments";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
    return (
    <div className="container mt-4">
      <h1 className="mb-3">University Innovation and Improvement Hub</h1>
      {userInfo ? (
        <div>
          <h3>Welcome, {userInfo.fullName} 👋</h3>


          {/* <GetNumberOfIdeaByDepartment/>
          <GetNumberOfIdeaByPercentage/>
          <GetContributorsByDepartment/>
          <GetAnonymousIdeasAndComments/> */}
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
