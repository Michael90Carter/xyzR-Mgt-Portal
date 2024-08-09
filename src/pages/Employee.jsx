import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useTable, useSortBy, usePagination} from 'react-table';
import Modal from 'react-modal';
import './Employee.css';

import { useStateContext } from '../contexts/ContextProvider';

const EmployeeList = () => {
    const currentColor = useStateContext();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTcxOTUyNDgzNSwiaXNzIjoiWW91cklzc3VlciIsImF1ZCI6IllvdXJBdWRpZW5jZSJ9.GVjDcGcz3vmIFQAZPhNFhjp0bniiYWUL_LIfCFChoOE';
    const [modalIsOpen, setModalIsOpen ] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
      firstName:'',
      lastName:'',
      email:'',
      department:'',
      phone:''
    });

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editEmployeeData, setEditEmployeeData] = useState({
      firstName:'',
      lastName:'',
      email:'',
      department:'',
      phone:''
    });

    const customStyles ={
      content:{
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight:'-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxWidth: '500px',
        Padding: '20px',
        borderRadius: '8px',

      },
      overlay: {
        backgroundColor: 'rbba(0, 0, 0, 0.5)'
      },
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                
                const response = await axios.get('https://localhost:7169/api/Employees', {
                    headers: {
                        Authorization: `Bearer$ {token}`,
                    },
                });
                setEmployees(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [token]);

    const columns = React.useMemo(
      () => [
        { Header: 'Id', accessor: 'id' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'phone' },
        { Header: 'Department', accessor: 'department' },
        {
          Header: 'Actions',
          accessor:'actions',
          Cell: ({ row }) => (
            <div>
              <button onClick={() => handleEditClick(row.original)}>Edit</button>
              <button onClick={() => handleDelete(row.original.id)}>Delete</button>
            </div>
          )
        }
      ],
      []
    );

  

    const data = React.useMemo(() => employees, [employees]);

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
      setNewEmployee({ ...newEmployee, [name]: value });
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('https://localhost:7169/api/Employees', newEmployee, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setEmployees([...employees, response.data]);
        setNewEmployee({ firstName: '', lastName: '', email: '', department: '', phone: '' });
        closeModal();
      } catch (error) {
        setError(error);
      }
    };

    const handleEditClick = (employee) => {
      setEditingEmployee(employee);
      setEditEmployeeData({
        firstName: employee.firstName,
        firstName: employee.lastName,
        email: employee.email,
        department: employee.department,
        phone: employee.phone,

      });
      setEditModalIsOpen(true);
    };

    const closeEditModal =() => {
      setEditModalIsOpen(false);
      setEditingEmployee(null);
    };

    const handleEditInputChange = (e) => {
      const {name, value }= e.target;

      setEditingEmployeeData({...editingEmployeeData, [name]: value});

    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try{
        const response = await axios.put(`https://localhost:7169/api/Employees/${editingEmployee.id}`, editEmployeeData, {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? response.data : emp));
        closeEditModal();
      } catch (error) {
        setError(error);
      }
      };

      const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are You Sure you want to Delete this Employee ?");
        if (!confirmDelete) {
          return;
        }

        try{
          await axios.delete(`https://localhost:7169/api/Employees/${id}`, {
            headers: {
              Authorization:`Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          setEmployees(employees.filter(emp => emp.id !== id));
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
      const csv = convertToCsv(employees);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading employees: {error.message}</p>;

    return (
        <div className="flex m-3 flex-wrap justify-end gap-1 items-center mt-5">


            <div className='mt-10'>
            <div className='justify-end flex m-3 flex-wrap  gap-1 items-center '>
            <button onClick={openModal} >Add New</button>

              <button onClick={exportToCsv} >Export to CSV</button>

            </div>
            </div>
              
            
          
            
            <table {...getTableProps()} className="table">

            <thead>
            
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

        <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={closeModal} contentLabel="Add New Employee">
        <h2 className='mt-2 flex m-3 flex-wrap justify-center gap-1 items-center '>Add Employee</h2>
        <form onSubmit={handleSubmit}className='mt-5'>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={newEmployee.firstName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={newEmployee.lastName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="phone"
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={newEmployee.department}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Add Employee</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
      <Modal isOpen={editModalIsOpen} style={customStyles} onRequestClose={closeEditModal} contentLabel='Edit Employee'>
          <h1 className='flex m-3 flex-wrap justify-center gap-1 items-center '>Edit Employee</h1>
          <form onSubmit={handleEditSubmit} className='mt-10'>
            
         
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={editEmployeeData.firstName}
              onChange={handleEditInputChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={editEmployeeData.lastName}
              onChange={handleEditInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editEmployeeData.email}
              onChange={handleEditInputChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="phone"
              name="phone"
              value={editEmployeeData.phone}
              onChange={handleEditInputChange}
              required
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={editEmployeeData.department}
              onChange={handleEditInputChange}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={closeEditModal} style={currentColor}>
            Cancel
          </button>
        

          </form>
      </Modal>

        </div>
    );
  
};

export default EmployeeList;