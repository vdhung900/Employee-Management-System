import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../services/departmentService";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAllDepartments();
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("An error occurred while loading departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentService.deleteDepartment(id);
        alert("Department deleted successfully");
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("An error occurred while deleting the department");
      }
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Department Management</h2>
          <Button variant="primary" onClick={() => navigate("/departments/new")}>
            <FaPlus className="me-2" />
            Add New Department
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Number of Employees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department._id}>
                    <td>{department.name}</td>
                    <td>{department.description || "N/A"}</td>
                    <td>
                      <Badge bg="info">
                        {department.employeeIds?.length || 0} employees
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/departments/${department._id}`)}
                      >
                        <FaEye /> View
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`/departments/${department._id}/edit`)
                        }
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(department._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DepartmentList; 