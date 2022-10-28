import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { resetPassword } from '../actions/userActions';
import resetBackground from '../assets/images/reset-password.jpg';

const ResetPasswordScreen = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const { id } = useParams();
  const dispatch = useDispatch();

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

  const { loading, resetPass, error } = useSelector(
    (state) => state.userResetPassword
  );

  useEffect(() => {
    if (resetPass) {
      setMessage(true);
    }
  }, [resetPass]);

  const validateForm = () => {
    const { password, confirmPassword } = form;
    const newErrors = {};

    if (!password || password === '')
      newErrors.password = 'Please enter password';
    if (!confirmPassword || confirmPassword === '') {
      newErrors.confirmPassword = 'Please enter confirm password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Password do not match';
    }
    return newErrors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      dispatch(resetPassword(id, { ...form }));
      setForm({});
    }
  };

  return (
    <Container style={{ marginTop: '100px' }}>
      <Meta title="Reset password" />
      <Row
        className="justify-content-between mx-5"
        style={{ marginTop: '80px' }}
      >
        <Col md={7}>
          <img src={resetBackground} alt="" width={'100%'} height={'450vh'} />
        </Col>
        <Col md={5}>
          <Card className="p-3 mt-5">
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            <Form onSubmit={submitHandler} className="">
              <h1 className="mt-2">Enter Your New Password</h1>
              {message ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>
                  Pasword changed successfully
                </p>
              ) : (
                ''
              )}
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
                Reset Password
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordScreen;
