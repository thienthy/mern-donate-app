import React, { useEffect, useMemo } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import { listDonations } from '../actions/donationActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { useNavigate } from 'react-router-dom';

const DonationListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { loading, error, donations } = useSelector(
    (state) => state.donationList
  );

  const numberWithDot = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'userId',
        Cell: ({ row }) => row.values.userId.email,
      },
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
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    } else {
      dispatch(listDonations());
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <Container>
      <Meta title="Donations" />
      <Row className="align-items-center">
        <Col>
          <h2>Donations</h2>
        </Col>
        <Col className="text-center"></Col>
        <Col className="text-end">
          <input
            type="text"
            className="w-30 form-control my-3"
            value={globalFilter || ''}
            placeholder="Search all"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Col>
      </Row>
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
    </Container>
  );
};

export default DonationListScreen;
