import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import verifyEmail from '../assets/images/verify-email.jpg';

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const { data } = await axios.get(
          `/api/users/${param.id}/verify/${param.token}`
        );
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <Container>
      {validUrl ? (
        <div
          className="d-flex flex-column align-items-center"
          style={{ position: 'relative', top: '20px' }}
        >
          <img src={verifyEmail} alt="" width="500px" />
          <h2>Email verified successfully</h2>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ width: '100px' }}
          >
            Login
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </Container>
  );
};

export default EmailVerify;
