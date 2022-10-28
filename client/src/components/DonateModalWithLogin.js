import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { getProjectDetails } from '../actions/projectActions';
import { userDonate } from '../actions/donationActions';
import { DONATION_CREATE_RESET } from '../constants/donationConstants';
import { toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const DonateModalWithLogin = ({
  showModalUserDonate,
  closeModalUserDonate,
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

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingDonate,
    error: errorDonate,
    success: successDonate,
  } = useSelector((state) => state.donationCreate);

  useEffect(() => {
    if (successDonate) {
      dispatch({ type: DONATION_CREATE_RESET });
    } else {
      dispatch(getProjectDetails(id));
    }
  }, [dispatch, navigate, id, successDonate]);

  const validateForm = () => {
    const { money } = form;
    const newErrors = {};

    if (!money || money === '') {
      newErrors.money = 'Please enter money';
    } else if (!money || money <= 0)
      newErrors.money = 'Money cannot be less than 0';

    return newErrors;
  };

  const payNow = async (token) => {
    try {
      const response = await axios({
        url: 'http://localhost:5000/api/donations/payment',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          amount: form.money,
          token,
        },
      });
      if (response.status === 200) {
        dispatch(
          userDonate({
            ...form,
            userId: userInfo._id,
            projectId: id,
          })
        );
        setForm({});
        closeModalUserDonate();
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
      <Modal show={showModalUserDonate} onHide={closeModalUserDonate}>
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
                <strong>{numberWithDot(currentDonation)}đ</strong> /{' '}
                {numberWithDot(project.targetDonation)}đ
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
                  Lượt quyên góp
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>{project.donationsId?.length}</strong>
                </Card.Text>
              </div>

              <div>
                <Card.Text className="mb-0" style={{ opacity: '70%' }}>
                  Đạt được
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>{percent}%</strong>
                </Card.Text>
              </div>

              <div>
                <Card.Text className="mb-0" style={{ opacity: '70%' }}>
                  Thời hạn còn
                </Card.Text>
                <Card.Text className="fs-5">
                  <strong>
                    {project.remainTime > 0
                      ? `${project.remainTime} Ngày`
                      : null}
                  </strong>
                </Card.Text>
              </div>
            </div>
          </Card>
          <hr />
          <div>
            <p>
              <b>Receiver:</b> Công ty Cổ phần Dịch vụ Di Động Trực tuyến (Ví
              MoMo)
            </p>
            <p>
              <b>Bank Account Number:</b> 123456789
            </p>
            <p>
              <i>
                *MoMo biết rằng còn rất nhiều hoàn cảnh khó khăn trên khắp đất
                nước của chúng ta cần được bảo trợ. Bạn hay các công ty hãy liên
                hệ với chúng tôi để cùng tài trợ, giúp đỡ tạo nên một cộng đồng
                Việt Nam nhân ái nhé!*
              </i>
            </p>
          </div>
          <hr />
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="money">
              <Form.Label>Money</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter money"
                autoFocus
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
                onClick={closeModalUserDonate}
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
                disabled={form.money === null || form.money <= 0}
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

export default DonateModalWithLogin;
