import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Modal, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import success from '../assets/images/success.png';
import registerBackground from '../assets/images/register-logo.jpeg';
import avatar from '../assets/images/avatar.jpg';
import axios from 'axios';

const RegisterScreen = () => {
  const [showModal, setShowModal] = useState(false);
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      setShowModal(true);
    }
  }, [dispatch, setShowModal, userInfo]);

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
      dispatch(register({ ...form, avatar: url }));
      setImagePreview(null);
    } else {
      dispatch(register({ ...form }));
    }
    setForm({});
  };

  return (
    <Container>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Row className="justify-content-between mt-5 mx-5">
        <Col md={7}>
          <img
            src={registerBackground}
            alt=""
            width={'100%'}
            height={'500vh'}
            className="mt-2"
          />
        </Col>
        <Col md={5}>
          <Form onSubmit={submitHandler} className="">
            <h1 className="mt-4 text-center">Register</h1>
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

            <Button type="submit" variant="primary">
              Register
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              Have an Account? <Link to="/login">Login</Link>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={toggleModal}
        style={{ marginTop: '200px' }}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title>
            <img src={success} alt="" width="100px" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Modal.Title>Success!</Modal.Title>
          <p>We're have sent a confirmation to your e-mail for verification</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={toggleModal}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RegisterScreen;
