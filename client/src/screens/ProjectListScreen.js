import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import { listProjectsByAdmin, deleteProject } from '../actions/projectActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import warning from '../assets/images/x-cross.png';
import { toast } from 'react-toastify';

const List = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { loading, error, projects } = useSelector(
    (state) => state.projectListByAdmin
  );

  const numberWithDot = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.projectDelete);

  const handleShow = useCallback(
    (projectId) => {
      setProjectId(projectId);
      setShowModal(!showModal);
    },
    [showModal]
  );

  const handleClose = useCallback(() => {
    setProjectId(null);
    setShowModal(!showModal);
  }, [showModal]);

  const deleteHandler = useCallback(
    (id) => {
      dispatch(deleteProject(id));
      handleClose();
      toast.success('Project deleted successfully!');
    },
    [dispatch, handleClose]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Target',
        accessor: 'donationsId',
        Cell: ({ row }) =>
          numberWithDot(
            row.values.donationsId.reduce((prev, item) => {
              return prev + item.money;
            }, 0)
          ) + ' đ',
      },
      {
        Header: 'Target Donation',
        accessor: 'targetDonation',
        Cell: ({ row }) => numberWithDot(row.values.targetDonation) + ' đ',
      },
      {
        Header: 'Time Range',
        accessor: 'remainTime',
        Cell: ({ row }) =>
          row.values.status === 'Donate'
            ? 'Còn ' + row.values.remainTime + ' Ngày'
            : null,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => (
          <span>
            {row.values.status === 'Donate' ? (
              <i className="fas fa-circle me-2 text-primary"></i>
            ) : row.values.status === 'Complete' ? (
              <i className="fas fa-circle me-2 text-success"></i>
            ) : (
              <i className="fas fa-circle me-2 text-warning"></i>
            )}
            {row.values.status}
          </span>
        ),
      },
      {
        Header: 'Action',
        accessor: '_id',
        Cell: ({ row }) => (
          <>
            <LinkContainer to={`/admin/project/edit/${row.values._id}`}>
              <Button variant="light" className="btn-sm">
                <i className="fas fa-edit" title="Edit"></i>
              </Button>
            </LinkContainer>
            <Button
              variant="danger"
              className="btn-sm"
              disabled={row.values.donationsId.length > 0 ? true : false}
              onClick={() => {
                handleShow(row.values._id);
              }}
            >
              <i className="fas fa-trash" title="Delete"></i>
            </Button>
          </>
        ),
      },
    ],
    [handleShow]
  );

  const data = useMemo(() => projects, [projects]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    } else {
      dispatch(listProjectsByAdmin());
    }
  }, [successDelete, navigate, userInfo, dispatch]);

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h2>Projects</h2>
        </Col>
        <Col className="text-center">
          <LinkContainer to={`/admin/projects/create`}>
            <Button className="my-3">Create Project</Button>
          </LinkContainer>
        </Col>
        <Col className="text-end">
          <input
            type="text"
            className="w-30 form-control"
            value={globalFilter || ''}
            placeholder="Search all"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div
            style={{ padding: '0.5rem' }}
            className="d-flex justify-content-between"
          >
            <div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginRight: '80px' }}>
              <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
              </Button>{' '}
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </Button>{' '}
              <span>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </Button>{' '}
              <Button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </Button>{' '}
            </div>
            <div></div>
          </div>
        </>
      )}

      <Modal
        show={showModal}
        onHide={handleClose}
        style={{ marginTop: '200px' }}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title>
            <img src={warning} alt="" width="100px" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Modal.Title>Are you sure!</Modal.Title>
          <p>
            Do you really want to delete these items? This process cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteHandler(projectId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default List;
