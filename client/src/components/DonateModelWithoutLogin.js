import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { getProjectDetails } from '../actions/projectActions';
import { donateWithoutLogin } from '../actions/donationActions';
import { DONATION_WITHOUT_LOGIN_RESET } from '../constants/donationConstants';
import { toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const DonateModalWithoutLogin = ({
  showModalWithoutLogin,
  closeModalWithoutLogin,
  project,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

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

  const {
    loading: loadingDonate,
    error: errorDonate,
    success: successDonate,
  } = useSelector((state) => state.donationWithoutLogin);

  useEffect(() => {
    if (successDonate) {
      dispatch({ type: DONATION_WITHOUT_LOGIN_RESET });
    } else {
      dispatch(getProjectDetails(id));
    }
  }, [dispatch, navigate, id, successDonate]);

  const validateForm = () => {
    const { name, email, money } = form;
    const newErrors = {};

    if (!name || name === '') newErrors.name = 'Please enter name';
    if (!email || email === '') newErrors.email = 'Please enter email';
    if (!money || money === '') {
      newErrors.money = 'Please enter money';
    } else if (!money || money <= 0)
      newErrors.money = 'Money cannot be less than 0';

    return newErrors;
  };

  const payNow = async (token) => {
    try {
      const response = await axios({
        url: 'https://mern-donateapp.onrender.com/api/donations/payment',
        method: 'post',
        data: {
          amount: form.money,
          token,
        },
      });
      if (response.status === 200) {
        dispatch(
          donateWithoutLogin({
            ...form,
            projectId: id,
          })
        );
        setForm({});
        closeModalWithoutLogin();
        toast.success('Donate success!');
      }
    } catch (error) {
      toast.error('Payment fail');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    }
  };

  const numberWithDot = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const currentDonation = project.donationsId?.reduce((prev, item) => {
    return prev + item.money;
  }, 0);

  const percent = ((currentDonation / project.targetDonation) * 100).toFixed(2);

  return (
    <>
      <Modal show={showModalWithoutLogin} onHide={closeModalWithoutLogin}>
        {loadingDonate && <Loader />}
        {errorDonate && <Message variant="danger">{errorDonate}</Message>}
        <Modal.Header closeButton>
          <Modal.Title>Donate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-2">
            <h5>{project.title}</h5>
            <div className="mb-3 d-flex justify-content-between ">
              <Card.Text className="my-1">
                <strong>{numberWithDot(currentDonation)}??</strong> /{' '}
                {numberWithDot(project.targetDonation)}??
              </Card.Text>
            </div>

            <div className="progress  mb-2" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-label="Success example"
                style={{ width: `${percent}%` }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <div
              style={{ fontSize: '14px' }}
              className="pb-2 d-flex justify-content-between "
            >
              <div>
                <Card.Text className="mb-0" style={{ opacity: '70%' }}>
                  L?????t quy??n g??p
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>{project.donationsId?.length}</strong>
                </Card.Text>
              </div>

              <div>
                <Card.Text className="mb-0" style={{ opacity: '70%' }}>
                  ?????t ???????c
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>{percent}%</strong>
                </Card.Text>
              </div>

              <div>
                <Card.Text className="mb-0" style={{ opacity: '70%' }}>
                  Th???i h???n c??n
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>
                    {project.remainTime > 0
                      ? `${project.remainTime} Ng??y`
                      : null}
                  </strong>
                </Card.Text>
              </div>
            </div>
          </Card>
          <hr />
          <div>
            <p>
              <b>Receiver:</b> C??ng ty C??? ph???n D???ch v??? Di ?????ng Tr???c tuy???n (V??
              MoMo)
            </p>
            <p>
              <b>Bank Account Number:</b> 123456789
            </p>
            <p>
              <i>
                *MoMo bi???t r???ng c??n r???t nhi???u ho??n c???nh kh?? kh??n tr??n kh???p ?????t
                n?????c c???a ch??ng ta c???n ???????c b???o tr???. B???n hay c??c c??ng ty h??y li??n
                h??? v???i ch??ng t??i ????? c??ng t??i tr???, gi??p ????? t???o n??n m???t c???ng ?????ng
                Vi???t Nam nh??n ??i nh??!*
              </i>
            </p>
          </div>
          <hr />
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                autoFocus
                value={form.name || ''}
                onChange={(e) => setField('name', e.target.value)}
                isInvalid={!!errors.name}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
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
            <Form.Group className="mb-3" controlId="money">
              <Form.Label>Money</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter money"
                value={form.money || ''}
                onChange={(e) => setField('money', e.target.value)}
                isInvalid={!!errors.money}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.money}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-center mt-4 mb-2">
              <Button
                variant="secondary"
                onClick={closeModalWithoutLogin}
                className="mx-2"
              >
                Cancel
              </Button>
              <StripeCheckout
                stripeKey={publicKey}
                label="Donate"
                name="Pay With Credit Card"
                amount={Number(form.money)}
                currency="VND"
                token={payNow}
                disabled={form === null || form.money <= 0}
              >
                <Button className="btn-modal-donate mx-2" type="submit">
                  Donate
                </Button>
              </StripeCheckout>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DonateModalWithoutLogin;
