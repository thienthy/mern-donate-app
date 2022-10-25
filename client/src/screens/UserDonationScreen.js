import React, { useEffect, useMemo } from 'react';
import { Row, Col, Table, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails } from '../actions/userActions';
import { listUserDonations } from '../actions/donationActions';
import { useTable, useSortBy, usePagination } from 'react-table';

const UserDonationScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: loadingDonations,
    error: errorDonations,
    donations,
  } = useSelector((state) => state.userDonationsList);

  const { userInfo } = useSelector((state) => state.userLogin);

  const numberWithDot = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'projectId',
        Cell: ({ row }) => row.values.projectId.title,
      },
      {
        Header: 'Image',
        id: 'image',
        accessor: 'projectId',
        Cell: ({ row }) => (
          <img src={row.values.projectId.image} alt="" width={'100px'} />
        ),
      },
      {
        Header: 'Money',
        accessor: 'money',
        Cell: ({ row }) => numberWithDot(row.values.money) + ' đ',
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ row }) => row.values.createdAt.substring(0, 10),
      },
    ],
    []
  );

  const data = useMemo(() => donations, [donations]);

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    }
    if (!user || user._id !== id) {
      dispatch(getUserDetails(id));
      dispatch(listUserDonations(id));
    }
  }, [dispatch, navigate, user, id, userInfo]);

  return (
    <Container style={{ marginTop: '90px' }}>
      <Link to="/admin/users" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row>
        <Col>
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
          <h3 className="mt-2">Donations List: {user.email}</h3>
          {loadingDonations ? (
            <Loader />
          ) : errorDonations ? (
            <Message variant="danger">{errorDonations}</Message>
          ) : (
            <>
              <Table striped bordered hover responsive {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
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
                          <td {...cell.getCellProps()}>
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
                  <Button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
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
        </Col>
      </Row>
    </Container>
  );
};

export default UserDonationScreen;
