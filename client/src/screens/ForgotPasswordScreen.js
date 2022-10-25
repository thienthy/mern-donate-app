import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import forgotBackground from '../assets/images/forgot-password.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (email === '') {
      toast.error('Email is required!', {
        position: 'top-center',
      });
    } else {
      const config = JSON.stringify({ email });
      const res = await axios.post('/api/users/forgot-password', config, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.data;

      if (data.statusCode === 201) {
        setEmail('');
        setMessage(true);
      } else {
        toast.error('Invalid Email', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <Container>
      <Row
        className="justify-content-between mx-5"
        style={{ marginTop: '80px' }}
      >
        <Col md={7}>
          <img src={forgotBackground} alt="" width={'100%'} height={'450vh'} />
        </Col>
        <Col md={5}>
          <Card className="mt-5">
            <Form onSubmit={submitHandler} className="p-3">
              <h1 className="mt-3">Forgot Password?</h1>
              <p>Enter the email address associated with your account.</p>
              {message ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>
                  Pasword reset link send successfully in your email
                </p>
              ) : (
                ''
              )}
              <Form.Group className="mb-3" controlId="email">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
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

export default ForgotPasswordScreen;
