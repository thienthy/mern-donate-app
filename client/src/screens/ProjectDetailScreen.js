import React, { useState } from 'react';
import { Row, Col, CardImg } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import heart from '../assets/images/icon-heart.png';
import DonateModalWithLogin from '../components/DonateModalWithLogin';
import DonateModalWithoutLogin from '../components/DonateModelWithoutLogin';

const ProjectDetailScreen = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showModalWithoutLogin, setShowModalWithoutLogin] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);

  const handleShowUserDonate = () => {
    if (!userInfo) {
      navigate('/login');
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseUserDonate = () => {
    setShowModal(false);
  };

  const handleShowDonateWihoutLogin = () => {
    setShowModalWithoutLogin(true);
  };

  const handleCloseDonateWithoutLogin = () => {
    setShowModalWithoutLogin(false);
  };

  const { loading, error, project } = useSelector(
    (state) => state.projectDetails
  );

  const numberWithDot = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const currentDonation = project.donationsId?.reduce((prev, item) => {
    return prev + item.money;
  }, 0);

  const percent = ((currentDonation / project.targetDonation) * 100).toFixed(2);

  return (
    <div className="container-md" style={{ marginTop: '5.5rem' }}>
      <Meta title={project.title} />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {project && (
            <div key={project._id} className="mt-3">
              <Row className="g-4">
                <Col md={12} lg={8}>
                  <h3>{project.title}</h3>
                  <p>
                    <img src={heart} alt="" className="me-2" width={26} />
                    {project.desc}
                  </p>
                  <img
                    src={project.image}
                    className="card-img-top mb-3"
                    alt={project.title}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: project.post }}
                    className="post-image"
                  ></div>
                </Col>
                <Col md={12} lg={4} className="fixed-sideBar">
                  <Card className="text-start" style={{ borderRadius: '16px' }}>
                    <Card.Body>
                      <Card.Title as="h3" className="text-center">
                        Thông tin quyên góp
                      </Card.Title>
                      <CardImg
                        src={project.image}
                        className="card-img-top"
                        alt={project.title}
                        style={{
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px',
                        }}
                      />
                    </Card.Body>
                    <div className="mb-3 d-flex justify-content-between card-margin">
                      <Card.Text className="my-1">
                        <strong>{numberWithDot(currentDonation)}đ</strong> /{' '}
                        {numberWithDot(project.targetDonation)}đ
                      </Card.Text>
                    </div>

                    <div
                      className="progress card-margin mb-2"
                      style={{ height: '6px' }}
                    >
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
                      className="pb-2 d-flex justify-content-between card-margin"
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
                    <div className="mx-3 mb-3">
                      {project.status === 'Donate' ? (
                        <Button
                          className="detail-btn-donate"
                          onClick={handleShowUserDonate}
                        >
                          {!userInfo ? 'Login to Donate' : 'Donate'}
                        </Button>
                      ) : project.status === 'Complete' ? (
                        <Button className="detail-btn-complete">
                          {project.status}
                        </Button>
                      ) : (
                        <Button className="detail-btn-finish">
                          {project.status}
                        </Button>
                      )}
                    </div>
                    <div className="mx-3 mb-3">
                      {project.status === 'Donate' && !userInfo && (
                        <Button
                          className="btn-primary w-100"
                          onClick={handleShowDonateWihoutLogin}
                          style={{ fontSize: '18px' }}
                        >
                          Donate without Login
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}

      <DonateModalWithLogin
        showModalUserDonate={showModal}
        closeModalUserDonate={handleCloseUserDonate}
        project={project}
      />
      <DonateModalWithoutLogin
        showModalWithoutLogin={showModalWithoutLogin}
        closeModalWithoutLogin={handleCloseDonateWithoutLogin}
        project={project}
      />
    </div>
  );
};

export default ProjectDetailScreen;
