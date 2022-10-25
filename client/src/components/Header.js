import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import logo from '../assets/images/momo.png';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // dispatch action to logout user
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header style={{ marginBottom: '73px' }}>
      <Navbar
        expand="lg"
        className="fixed-top"
        collapseOnSelect
        style={{ borderBottom: '1px solid #d6d6d6', backgroundColor: '#fff' }}
      >
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="" className="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* display when user login is Admin */}
            {userInfo && userInfo.isAdmin && (
              <>
                <LinkContainer to="/admin/projects">
                  <Nav.Link>Projects</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <Nav.Link>Users</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/donations">
                  <Nav.Link>Donations</Nav.Link>
                </LinkContainer>
              </>
            )}
            <Nav className="ms-auto">
              {/* display when user login */}
              {userInfo ? (
                <>
                  <img src={userInfo.avatar} alt="" className="navbar-avatar" />
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/my-donations">
                      <NavDropdown.Item>My Donations</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Register
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
