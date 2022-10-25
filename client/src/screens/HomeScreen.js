import React, { useEffect } from 'react';
import { Row, Col, Pagination } from 'react-bootstrap';
import banner from '../assets/images/banner-momo.jpg';
import Project from '../components/Project';
import { useDispatch, useSelector } from 'react-redux';
import { listProjects } from '../actions/projectActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  const { pageNumber } = useParams() || 1;

  const dispatch = useDispatch();

  const { error, loading, projects, page, pages } = useSelector(
    (state) => state.projectList
  );

  useEffect(() => {
    dispatch(listProjects(pageNumber));
  }, [dispatch, pageNumber]);

  return (
    <div
      className="text-center pb-2"
      style={{ backgroundColor: '#fdf2f8', view: '80%' }}
    >
      <img src={banner} alt="" width="100%" />
      <h2
        style={{ color: '#A50064', fontSize: '1.75rem' }}
        className="mt-4 mx-3"
      >
        Các hoàn cảnh quyên góp
      </h2>
      <h5 style={{ color: '#747373', fontSize: '1rem' }} className="mx-3 mb-3">
        Chung tay quyên góp giúp đỡ các hoàn cảnh khó khăn trên khắp cả nước.
      </h5>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mx-5 g-4">
            {projects.map((project) => (
              <Col key={project._id} sm={12} md={6} lg={4}>
                <Project project={project} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-3">
            {pages > 1 && (
              <Pagination>
                <LinkContainer to={`/page/${page - 1}`}>
                  <Pagination.Prev disabled={page === 1}></Pagination.Prev>
                </LinkContainer>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer key={x + 1} to={`/page/${x + 1}`}>
                    <Pagination.Item active={x + 1 === page}>
                      {x + 1}
                    </Pagination.Item>
                  </LinkContainer>
                ))}
                <LinkContainer to={`/page/${page + 1}`}>
                  <Pagination.Next disabled={page === pages}></Pagination.Next>
                </LinkContainer>
              </Pagination>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
