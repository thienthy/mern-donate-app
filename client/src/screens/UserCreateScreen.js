import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { createUser } from '../actions/userActions';
import { USER_CREATE_RESET } from '../constants/userConstants';
import avatar from '../assets/images/avatar.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserCreateScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  // eslint-disable-next-line
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert('Max file size is 1mb');
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // submit file to multer upload, get the url
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      setUploadingImg(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setUploadingImg(false);
      return data;
    } catch (error) {
      setUploadingImg(false);
      console.error(error);
    }
  };

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = useSelector((state) => state.userCreate);

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    }
    if (successCreate) {
      dispatch({ type: USER_CREATE_RESET });
      navigate('/admin/users');
      toast.success('User created successfully!');
    }
    dispatch(createUser);
  }, [dispatch, navigate, successCreate, userInfo]);

  const validateForm = () => {
    const { name, email, password, confirmPassword } = form;
    const newErrors = {};

    if (!name || name === '') newErrors.name = 'Please enter name';
    if (!email || email === '') newErrors.email = 'Please enter email';
    if (!password || password === '')
      newErrors.password = 'Please enter password';
    if (!confirmPassword || confirmPassword === '') {
      newErrors.confirmPassword = 'Please enter confirm password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Password do not match';
    }
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else if (imagePreview) {
      const url = await uploadImage(image);
      dispatch(createUser({ ...form, avatar: url }));
      setImagePreview(null);
    } else {
      dispatch(createUser({ ...form }));
    }
    setForm({});
  };

  return (
    <Container>
      <Meta title="User create" />
      <Link to="/admin/users" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <Card className="p-3">
          <h1 className="text-center">Create User</h1>
          {loadingCreate && <Loader />}
          {errorCreate && <Message variant="danger">{errorCreate}</Message>}
          <Form onSubmit={submitHandler} className="">
            <div className="signup-profile-container">
              <img
                src={imagePreview || avatar}
                className="signup-profile-picture"
                alt=""
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name || ''}
                onChange={(e) => setField('name', e.target.value)}
                isInvalid={!!errors.name}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form.email || ''}
                onChange={(e) => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={form.password || ''}
                onChange={(e) => setField('password', e.target.value)}
                isInvalid={!!errors.password}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter confirm password"
                value={form.confirmPassword || ''}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                isInvalid={!!errors.confirmPassword}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="status">
              <>
                <Form.Label>Status</Form.Label>
                <div className="form-check form-check-inline mx-4">
                  <input
                    className="form-check-input"
                    id="active"
                    type="radio"
                    name="status"
                    value={`Active || ${status}`}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="active">
                    Active
                  </label>
                </div>
                <div className="form-check form-check-inline">
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
                <div className="form-check form-check-inline mx-2">
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
              Create
            </Button>
          </Form>
        </Card>
      </FormContainer>
    </Container>
  );
};

export default UserCreateScreen;
