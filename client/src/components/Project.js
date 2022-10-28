import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardImg } from 'react-bootstrap';

const Project = ({ project }) => {
  // convert number 1000000 to 1.000.000
  const numberWithDot = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // caculate total current donation from users
  const currentDonation = project.donationsId.reduce((prev, item) => {
    return prev + item.money;
  }, 0);

  // convert number to percentage
  const percent = ((currentDonation / project.targetDonation) * 100).toFixed(2);

  return (
    <Link
      to={`/project/${project._id}`}
      className="text-decoration-none text-dark"
    >
      <Card className="h-100 text-start" style={{ borderRadius: '16px' }}>
        <CardImg
          src={project.image}
          className="card-img-top"
          alt={project.title}
          style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        />

        <Card.Body>
          <Card.Title as="div">
            <strong>{project.title}</strong>
          </Card.Title>
        </Card.Body>

        <div className="mb-3 d-flex justify-content-between card-margin">
          <Card.Text className="my-1">
            <strong>{numberWithDot(currentDonation)}</strong> /{' '}
            {numberWithDot(project.targetDonation)}đ
          </Card.Text>
        </div>

        <div className="progress card-margin mb-2" style={{ height: '6px' }}>
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
          style={{ fontSize: '12px' }}
          className="pb-2 d-flex justify-content-between card-margin"
        >
          <div>
            <Card.Text className="mb-0" style={{ opacity: '70%' }}>
              Lượt quyên góp
            </Card.Text>
            <Card.Text className="fs-6">
              <strong>{project.donationsId.length}</strong>
            </Card.Text>
          </div>

          <div>
            <Card.Text className="mb-0" style={{ opacity: '70%' }}>
              Đạt được
            </Card.Text>
            <Card.Text className="fs-6">
              <strong>{percent}%</strong>
            </Card.Text>
          </div>

          <div>
            <Button
              className={
                project.status === 'Donate'
                  ? 'home-btn-donate'
                  : project.status === 'Complete'
                  ? 'home-btn-complete'
                  : 'home-btn-finish'
              }
            >
              {project.status}
            </Button>
          </div>
        </div>
        <Card.Footer
          className="d-flex justify-content-center"
          style={{ backgroundColor: 'transparent' }}
        >
          {/* Hide remain time when "status" = Donate or remain time <= 0*/}
          {project.remainTime <= 0 ? (
            <Card.Text className="day-complete">0</Card.Text>
          ) : project.status === 'Donate' ? (
            <Card.Text className="day-left">
              Còn {project.remainTime} Ngày
            </Card.Text>
          ) : (
            <Card.Text className="day-complete">0</Card.Text>
          )}
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default Project;
