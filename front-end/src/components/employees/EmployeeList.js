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
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [allEmployees, setAllEmployees] = useState([]); // Lưu toàn bộ danh sách
  const [displayedEmployees, setDisplayedEmployees] = useState([]); // Danh sách hiển thị sau khi lọc
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    position: "",
  });
  const [departments, setDepartments] = useState([]);

  // Load employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getEmployees();
      const data = res.data.data;
      setAllEmployees(data);
      setDisplayedEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allEmployees];

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.departmentId?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(
        (emp) => emp.departmentId?.name === filters.department
      );
    }

    if (filters.position) {
      filtered = filtered.filter((emp) => emp.position === filters.position);
    }

    setDisplayedEmployees(filtered);
  };

  // Handle filter changes
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

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const viewEmployeeDetails = (employee) => {
    navigate(`/employees/${employee._id}`, { state: { employee } });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Employee Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => navigate("/employees/new")}>
            Add New Employee
          </Button>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name, department, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
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
        <Col md={4}>
          <Form.Select
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
          >
            <option value="">All Positions</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.fullName}</td>
                <td>{employee.departmentId?.name}</td>
                <td>{employee.position}</td>
                <td>{employee.phone}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => viewEmployeeDetails(employee)}
                  >
                    <FaEye /> View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/employees/${employee._id}/edit`)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(employee._id)}
                  >
                    <FaTrash /> Delete
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

export default EmployeeList;
