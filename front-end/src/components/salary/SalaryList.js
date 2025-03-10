import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { salaryService } from "../../services/salaryService";
import { departmentService } from "../../services/departmentService";

const SalaryList = () => {
  const navigate = useNavigate();
  const [allSalaries, setAllSalaries] = useState([]);
  const [displayedSalaries, setDisplayedSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    department: "",
  });

  // Load danh sách lương
  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await salaryService.getSalaries();
      const salaries = response.data.data;
      setAllSalaries(salaries);
      setDisplayedSalaries(salaries);
    } catch (error) {
      console.error("Error fetching salaries:", error);
      alert("An error occurred while loading data");
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách phòng ban
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("An error occurred while loading departments");
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchDepartments();
  }, []);

  const applyFilters = () => {
    let filtered = [...allSalaries];

    if (searchTerm) {
      filtered = filtered.filter(
        (salary) =>
          (salary.employeeId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    }

    if (filters.month) {
      filtered = filtered.filter(
        (salary) => new Date(salary.createdAt).getMonth() + 1 === parseInt(filters.month)
      );
    }

    if (filters.year) {
      filtered = filtered.filter(
        (salary) => new Date(salary.createdAt).getFullYear() === parseInt(filters.year)
      );
    }

    if (filters.department) {
      filtered = filtered.filter(
        (salary) => salary.employeeId?.departmentId?.name === filters.department
      );
    }

    setDisplayedSalaries(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        await salaryService.deleteSalary(id);
        fetchSalaries();
        alert("Salary record deleted successfully");
      } catch (error) {
        console.error("Error deleting salary:", error);
        alert("An error occurred while deleting the record");
      }
    }
  };

  const viewSalaryDetails = (salary) => {
    navigate(`/salaries/${salary._id}`, { state: { salary } });
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Salary Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => navigate("/salaries/new")}>
            Add New Salary Record
          </Button>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
          >
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Month/Year</th>
              <th>Base Salary</th>
              <th>Allowances</th>
              <th>Bonus</th>
              <th>Penalty</th>
              <th>Total Income</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSalaries.map((salary) => (
              <tr key={salary._id}>
                <td>{salary.employeeId?.fullName || 'N/A'}</td>
                <td>{salary.employeeId?.departmentId?.name || 'N/A'}</td>
                <td>
                  {salary.createdAt ? 
                    new Date(salary.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric"
                    }) : 'N/A'}
                </td>
                <td>{(salary.salaryBase || 0).toLocaleString()}đ</td>
                <td>{(salary.allowances || 0).toLocaleString()}đ</td>
                <td>{(salary.bonus || 0).toLocaleString()}đ</td>
                <td>{(salary.penalty || 0).toLocaleString()}đ</td>
                <td>{(salary.totalIncome || 0).toLocaleString()}đ</td>
                <td>{salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => viewSalaryDetails(salary)}
                  >
                    <FaEye /> 
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/salaries/${salary._id}/edit`)}
                  >
                    <FaEdit /> 
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(salary._id)}
                  >
                    <FaTrash /> 
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SalaryList; 