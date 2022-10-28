import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import {
  listUsers,
  deleteUser,
  deleteUserFailed,
} from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { toast } from 'react-toastify';
import warning from '../assets/images/x-cross.png';
import { useNavigate } from 'react-router-dom';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteFailedModal, setShowDeleteFailedModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [donationsId, setDonationsId] = useState([]);

  const { userInfo } = useSelector((state) => state.userLogin);

  const { loading, error, users } = useSelector((state) => state.userList);

  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.userDelete);

  const {
    loading: loadingDeleteFailed,
    error: errorDeleteFailed,
    success: successDeleteFailed,
  } = useSelector((state) => state.userDeleteFailed);

  // open Modal delete
  const handleDeleteShow = useCallback(
    (userId, donationsId) => {
      setUserId(userId);
      setDonationsId(donationsId);
      setShowDeleteModal(!showDeleteModal);
    },
    [showDeleteModal]
  );

  // close Modal delete
  const handleDeleteClose = useCallback(() => {
    setUserId(null);
    setDonationsId([]);
    setShowDeleteModal(!showDeleteModal);
  }, [showDeleteModal]);

  // open Modal delete failed
  const handleDeleteFailedShow = useCallback(() => {
    setShowDeleteFailedModal(!showDeleteFailedModal);
  }, [showDeleteFailedModal]);

  // close Modal delete failed
  const handleDeleteFailedClose = useCallback(() => {
    setShowDeleteFailedModal(!showDeleteFailedModal);
  }, [showDeleteFailedModal]);

  const deleteHandler = useCallback(
    (id, donations) => {
      if (donations.length > 0) {
        dispatch(deleteUserFailed(id));
        handleDeleteClose();
        handleDeleteFailedShow();
        toast.error('User deleted failure!');
      } else {
        dispatch(deleteUser(id));
        handleDeleteClose();
        toast.success('User deleted successfully!');
      }
    },
    [dispatch, handleDeleteClose, handleDeleteFailedShow]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Admin',
        accessor: 'isAdmin',
        Cell: ({ row }) => (row.values.isAdmin ? 'Admin' : ''),
      },
      {
        Header: 'Donations',
        id: 'donationsId',
        accessor: 'donationsId',
        Cell: ({ row }) => (
          <LinkContainer to={`/admin/user/donations/${row.values._id}`}>
            <Button
              className="btn-sm btn-success"
              disabled={row.values.donationsId.length === 0 ? true : false}
            >
              Details
            </Button>
          </LinkContainer>
        ),
      },
      {
        Header: 'Active Status',
        accessor: 'status',
        Cell: ({ row }) => (
          <span>
            {row.values.status === 'Active' ? (
              <i className="fas fa-circle me-2 text-primary"></i>
            ) : row.values.status === 'Not-Active' ? (
              <i className="fas fa-circle me-2 text-secondary"></i>
            ) : row.values.status === 'Denied' ? (
              <i className="fas fa-circle me-2 text-warning"></i>
            ) : (
              <i className="fas fa-circle me-2 text-danger"></i>
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
            <LinkContainer to={`/admin/user/edit/${row.values._id}`}>
              <Button variant="light" className="btn-sm">
                <i className="fas fa-edit" title="Edit"></i>
              </Button>
            </LinkContainer>
            <Button
              variant="danger"
              className="btn-sm"
              disabled={
                row.values.status === 'Deleted' || row.values.isAdmin
                  ? true
                  : false
              }
              onClick={() => {
                handleDeleteShow(row.values._id, row.values.donationsId);
              }}
            >
              <i className="fas fa-trash" title="Delete"></i>
            </Button>
          </>
        ),
      },
    ],
    [handleDeleteShow]
  );

  const data = useMemo(() => users, [users]);

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
      dispatch(listUsers());
    }
  }, [successDelete, navigate, userInfo, dispatch, successDeleteFailed]);

  return (
    <Container>
      <Meta title="Users" />
      <Row className="align-items-center">
        <Col>
          <h2>Users</h2>
        </Col>
        <Col className="text-center">
          <LinkContainer to={`/admin/users/create`}>
            <Button className="my-3">Add User</Button>
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
      {loadingDeleteFailed && <Loader />}
      {errorDeleteFailed && (
        <Message variant="danger">{errorDeleteFailed}</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Apply the table props */}
          <Table striped bordered hover responsive {...getTableProps()}>
            <thead>
              {/* Loop over the header rows */}
              {headerGroups.map((headerGroup) => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {/* Loop over the headers in each row */}
                  {headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {/* // Render the header */}
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
            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>
              {/* Loop over the table rows */}
              {page.map((row, i) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
                    {/* Loop over the rows cells */}
                    {row.cells.map((cell) => (
                      // Apply the cell props
                      <td {...cell.getCellProps()}>
                        {/* Render the cell contents */}
                        {cell.render('Cell')}
                      </td>
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
        show={showDeleteModal}
        onHide={handleDeleteClose}
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
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteHandler(userId, donationsId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteFailedModal}
        onHide={handleDeleteFailedClose}
        style={{ marginTop: '200px' }}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title>
            <img src={warning} alt="" width="100px" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Modal.Title>Deleted Failure!</Modal.Title>
          <p>This user has been donated. You cannot delete it!</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleDeleteFailedClose}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListScreen;
