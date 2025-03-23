import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { apiSlice } from '../slices/apiSlice' 
import { toast } from 'react-toastify'

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Logout failed');
    }
  };

  return (
    <header>
      <Navbar style={{ backgroundColor: "var(--bs-cyan)" }} variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            University
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">

              {/* Staff */}
              {userInfo ? (
                <>
                 <NavDropdown title='Idea' id='idea'>
                  <NavDropdown.Item as={Link} to='/ideas'>Idea</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/ideas/popular'>Most Popular Idea</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/ideas/dislike'>Most Disliked Idea</NavDropdown.Item>
                </NavDropdown>
                  <NavDropdown title={userInfo?.fullName || 'User'} id='username'>
                    <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin */}
              {userInfo && userInfo.role?.name === 'Admin' && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <NavDropdown.Item as={Link} to='/admin/users'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/categories'>
                    Categories
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/departments'>
                    Departments
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* QA Manager */}
              {userInfo && userInfo.role?.name === 'QA Manager' && (
                <NavDropdown title='QA Manager' id='qamenu'>
                  <NavDropdown.Item as={Link} to='/qa/users'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/categories'>
                    Categories
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/departments'>
                    Departments
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* QA Manager and Admin */}
              {userInfo && (userInfo.role?.name === 'Admin' || userInfo.role?.name === 'QA Manager') && (
                <NavDropdown title='AcademicYear' id='academicYear'>
                  <NavDropdown.Item as={Link} to='/academicYear/history'>
                    History
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to='/academicYear'>
                    Setting
                  </NavDropdown.Item>

          
                </NavDropdown>
              )}


              {/* QA Coordinator */}
              {userInfo && userInfo.role?.name === 'QA Coordinator' && (
                <NavDropdown title='QA Coordinator' id='qacmenu'>
                  <NavDropdown.Item as={Link} to='/qac/users'>
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
