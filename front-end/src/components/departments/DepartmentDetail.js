import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaUserPlus, FaTrash } from "react-icons/fa";
import { departmentService } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService";

const DepartmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchDepartmentDetails();
    fetchAvailableEmployees();
  }, [id]);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await departmentService.getDepartment(id);
      if (response.data.success) {
        setDepartment(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching department:", error);
      alert("An error occurred while loading department information");
      navigate("/departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEmployees = async () => {
    try {
      const response = await employeeService.getEmployees();
      if (response.data.success) {
        // Filter out employees not in current department
        const employees = response.data.data.filter(
          (emp) => !emp.departmentId || emp.departmentId._id !== id
        );
        setAvailableEmployees(employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("An error occurred while loading employee list");
    }
  };

  const handleAddEmployee = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    try {
      // Find selected employee info
      const selectedEmployeeInfo = availableEmployees.find(
        (emp) => emp._id === selectedEmployee
      );

      if (!selectedEmployeeInfo) {
        alert("Employee information not found");
        return;
      }

      // Check if employee is in another department
      if (selectedEmployeeInfo.departmentId) {
        const confirmTransfer = window.confirm(
          `Employee ${selectedEmployeeInfo.fullName} is currently in ${selectedEmployeeInfo.departmentId.name} department. \nDo you want to transfer them to ${department.name} department?`
        );
        if (!confirmTransfer) {
          return;
        }
      }

      const response = await departmentService.addEmployeeToDepartment(id, {
        employeeId: selectedEmployee,
      });

      if (response.data.success) {
        alert("Employee added to department successfully");
        setShowModal(false);
        setSelectedEmployee("");
        await fetchDepartmentDetails();
        await fetchAvailableEmployees();
      } else {
        alert(response.data.message || "Could not add employee to department");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(error.response?.data?.message || "An error occurred while adding employee to department");
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    if (
      window.confirm("Are you sure you want to remove this employee from the department?")
    ) {
      try {
        const response = await departmentService.removeEmployeeFromDepartment(employeeId);
        if (response.data.success) {
          alert("Employee removed from department successfully");
          await fetchDepartmentDetails();
          await fetchAvailableEmployees();
        } else {
          alert(response.data.message || "Could not remove employee from department");
        }
      } catch (error) {
        console.error("Error removing employee:", error);
        alert(error.response?.data?.message || "An error occurred while removing employee from department");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!department) {
    return <div className="text-center">Department not found</div>;
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={() => navigate("/departments")}
            >
              <FaArrowLeft /> Back to List
            </Button>
            <h2 className="mb-0">Department Details</h2>
          </div>
          <div>
            <Button
              variant="success"
              className="me-2"
              onClick={() => setShowModal(true)}
            >
              <FaUserPlus className="me-2" />
              Add Employee
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/departments/${id}/edit`)}
            >
              <FaEdit className="me-2" />
              Edit
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h4>Basic Information</h4>
              <div className="mb-3">
                <strong>Department Name:</strong> {department.name}
              </div>
              <div className="mb-3">
                <strong>Description:</strong>{" "}
                {department.description || "No description"}
              </div>
              <div className="mb-3">
                <strong>Total Employees:</strong>{" "}
                {department.employeeIds?.length || 0}
              </div>
            </Col>
          </Row>

          <h4>Employee List</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {department.employeeIds?.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.fullName}</td>
                  <td>{new Date(employee.dob).toLocaleDateString()}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveEmployee(employee._id)}
                    >
                      <FaTrash /> Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {(!department.employeeIds || department.employeeIds.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No employees in this department
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Employee Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee to Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Employee</Form.Label>
            <Form.Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Choose an employee</option>
              {availableEmployees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.fullName} - {employee.position}
                  {employee.departmentId ? ` (${employee.departmentId.name})` : ' (No department)'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DepartmentDetail; 