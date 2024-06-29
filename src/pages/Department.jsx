import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useTable, useSortBy, usePagination} from 'react-table';
//import { Button, button} from '../components';
import Modal from 'react-modal';
import './Department.css';
import { itemClick } from '@syncfusion/ej2/treemap';



const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTcxOTUyNDgzNSwiaXNzIjoiWW91cklzc3VlciIsImF1ZCI6IllvdXJBdWRpZW5jZSJ9.GVjDcGcz3vmIFQAZPhNFhjp0bniiYWUL_LIfCFChoOE';
    const [modalIsOpen, setModalIsOpen ] = useState(false);
    const [newDepartment, setNewDepartment ]= useState({

        departmentName:'',

    });
      
      
    

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                
                const response = await axios.get('https://localhost:7169/api/Departments', {
                    headers: {
                        Authorization: `Bearer$ {token}`,
                    },
                });
                setDepartments(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchDepartments();
    }, [token]);

    const columns = React.useMemo(
      () => [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Department', accessor: 'departmentName' },
       
      ],
      []
    );

    const data = React.useMemo(() => departments, [departments]);

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
      { columns, data, initialState: { pageIndex: 0 } },
      useSortBy,
      usePagination
    );

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
  

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDepartment({ ...newDepartment, [name]: value });
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('https://localhost:7169/api/Departments', newDepartment, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setDepartments([...departments, response.data]);
        setNewDepartment({ departmentName: ''});
        closeModal();
      } catch (error) {
        setError(error);
      }
    };

    const convertToCsv = (data) => {
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
  
      data.forEach(row => {
        const values = headers.map(header => row[header]);
        csvRows.push(values.join(','));
      });
  
      return csvRows.join('\n');
    };

    const exportToCsv = () => {
      const csv = convertToCsv(departments);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'departments.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading departments: {error.message}</p>;

    return (
        <div >
            <h1>Departments List</h1>
            <button onClick={openModal}>Add New</button>

           
            <button onClick={exportToCsv} >Export to CSV</button>
            <table {...getTableProps()} className="table">

            <thead >
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        </table>

        <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Add New Employee">
        <h2>Add Department</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Enter New Department:
            <input
              type="text"
              name="departmentName"
              value={newDepartment.departmentName}
              onChange={handleInputChange}
              required
            />
          </label>
          
          <button type="submit">Add </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>

        </div>
    );
};



export default DepartmentList;