import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import pagenotfoundImage from '../assets/images/pagenotfound.jpg';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Meta title="404 Page not found" />
      <div
        className="d-flex flex-column align-items-center"
        style={{ position: 'relative', top: '20px' }}
      >
        <h1>Oops..! 404 Page Not Found</h1>
        <p>Looks like you came to wrong page on our server</p>
        <img src={pagenotfoundImage} height="400" width="400" alt="not found" />
        <Button style={{ width: '100px' }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </Container>
  );
};

export default PageNotFound;
