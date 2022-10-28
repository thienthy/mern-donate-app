import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { login } from '../actions/userActions';
import loginBackground from '../assets/images/login-logo.jpg';
import Google from '../assets/images/google.png';
import axios from 'axios';
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // if the passport social login is successful, get the user's data and store in redux store
  useEffect(() => {
    // check for url params
    if (window.location.search.includes('success')) {
      const isSuccess = searchParams.get('login');
      const id = searchParams.get('id');

      // if successful login
      if (isSuccess) {
        // get user data and dispatch login success
        axios
          .post('/api/users/passport/data', {
            id,
          })
          .then(({ data }) => {
            const { id, email, name, avatar, isAdmin, status, token } = data;
            const userData = {
              id,
              email,
              name,
              avatar,
              isAdmin,
              status,
              token,
            };

            // login user in frontend
            dispatch({
              type: USER_LOGIN_SUCCESS,
              payload: userData,
            });

            // update the local storage
            localStorage.setItem('userInfo', JSON.stringify(userData));
            navigate('/');
          });
      }
    }
  }, [dispatch, navigate, searchParams]);

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container>
      <Meta title="Login" />
      {loading && <Loader />}
      <Row
        className="justify-content-between mx-5"
        style={{ marginTop: '80px' }}
      >
        <Col md={7}>
          <img src={loginBackground} alt="" width={'100%'} height={'450vh'} />
        </Col>
        <Col md={5}>
          <Form onSubmit={submitHandler} className="">
            <h1 className="mt-5">Login</h1>
            {error && <Message variant="danger">{error}</Message>}
            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-evenly mb-4">
              <Button
                type="submit"
                variant="primary"
                style={{ width: '200px' }}
              >
                Login
              </Button>
            </div>
          </Form>
          <h2 className="line">
            <span className="or">OR</span>
          </h2>
          <div className="d-flex justify-content-evenly">
            <a href="http://localhost:5000/auth/google">
              <Button
                className="mt-2"
                style={{ width: '200px', backgroundColor: '#df4930' }}
              >
                <img
                  src={Google}
                  alt=""
                  width={'18px'}
                  height={'18px'}
                  className="me-2"
                />
                Login with Google
              </Button>
            </a>
          </div>
          <Row className="py-3">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Col>
              New User? <Link to="/register">Register</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
