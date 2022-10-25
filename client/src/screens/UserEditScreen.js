import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import { toast } from 'react-toastify';

const UserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    }
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/admin/users');
      toast.success('User updated successfully!');
    } else {
      if (!user?.name || user?._id !== id) {
        dispatch(getUserDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
        setStatus(user.status);
      }
    }
  }, [dispatch, navigate, user, id, successUpdate, userInfo]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (name === '') {
      setMessage('Name cannot be blank');
    } else if (email === '') {
      setMessage('Email cannot be blank');
    } else {
      dispatch(updateUser({ _id: id, name, email, isAdmin, status }));
    }
  };

  return (
    <Container>
      <Link to="/admin/users" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <Card className="p-3">
          <h1>Edit User</h1>
          {message && <Message variant="danger">{message}</Message>}
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler} className="">
              <Form.Group className="mb-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  disabled
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mb-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mb-2" controlId="status">
                <>
                  <Form.Label>Status</Form.Label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="active"
                      type="radio"
                      name="status"
                      value="Active"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Active
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="not-active"
                      type="radio"
                      name="status"
                      value="Not-Active"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="not-active">
                      Not-Active
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="denied"
                      type="radio"
                      name="status"
                      value="Denied"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="denied">
                      Denied
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="deleted"
                      type="radio"
                      name="status"
                      value="Deleted"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="deleted">
                      Deleted
                    </label>
                  </div>
                </>
              </Form.Group>

              <Form.Group className="mb-3" controlId="isadmin">
                <Form.Label>Is Admin</Form.Label>
                <Form.Check
                  type="checkbox"
                  inline
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="ms-2"
                ></Form.Check>
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          )}
        </Card>
      </FormContainer>
    </Container>
  );
};

export default UserEditScreen;
