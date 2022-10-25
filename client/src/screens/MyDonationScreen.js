import React, { useEffect, useMemo } from 'react';
import { Row, Col, Table, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { myDonationsList } from '../actions/donationActions';
import { useTable, useSortBy, usePagination } from 'react-table';

const MyDonationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { loading, error, donations } = useSelector(
    (state) => state.myDonationsList
  );

  // convert number 1000000 to 1.000.000
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
    if (!userInfo) {
      navigate('/');
    } else {
      dispatch(myDonationsList());
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h2 className="my-3">Donations</h2>
        </Col>
      </Row>
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
    </Container>
  );
};

export default MyDonationScreen;
