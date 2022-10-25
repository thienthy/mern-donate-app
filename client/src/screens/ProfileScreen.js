import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  Modal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserProfile, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import cover from '../assets/images/cover.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  // eslint-disable-next-line
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userProfile);

  const { userInfo } = useSelector((state) => state.userLogin);

  const { success: successUpdate } = useSelector(
    (state) => state.userUpdateProfile
  );

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      if (!user || !user.email || successUpdate) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserProfile());
      } else {
        setName(user.name);
        setEmail(user.email);
        setImage(user.avatar);
      }
    }
  }, [dispatch, navigate, userInfo, user, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (name === '') {
      setMessage('Name cannot be blank');
    } else if (email === '') {
      setMessage('Email cannot be blank');
    } else if (imagePreview) {
      const url = await uploadImage(image);
      dispatch(
        updateUserProfile({ id: user._id, name, email, password, avatar: url })
      );
      setImagePreview(null);
      setMessage(null);
      setPassword('');
      setConfirmPassword('');
      handleClose();
      toast.success('Updated profile successfully');
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password,
          avatar: user.avatar,
        })
      );
      setMessage(null);
      setPassword('');
      setConfirmPassword('');
      handleClose();
      toast.success('Updated profile successfully');
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Row className="mt-5">
        <Col>
          {successUpdate && (
            <Message variant="success">Profile Updated</Message>
          )}
          {loading && <Loader />}
          <Card style={{ borderRadius: '16px', maxWidth: '400px' }}>
            <Card.Header style={{ padding: 0, height: '90px' }}>
              <img
                src={cover}
                alt=""
                width={'100%'}
                height={'100%'}
                style={{
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              />
              <div className="d-flex justify-content-evenly">
                <img src={user.avatar} alt="" className="profile-img" />
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mt-5">
                <strong>Name: {user.name}</strong>
              </Card.Text>
              <Card.Text>Email: {user.email}</Card.Text>
              <Card.Text>Joined: {user.createdAt?.substring(0, 10)}</Card.Text>
              <Button type="submit" variant="primary" onClick={handleShow}>
                Update
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleClose}
        style={{ marginTop: '40px' }}
      >
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        <Modal.Header closeButton>
          <Modal.Title>Edit Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler} className="">
            <div className="signup-profile-container">
              <img
                src={imagePreview || user.avatar}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

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

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <div className="text-center">
              <Button type="submit" variant="primary">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfileScreen;
