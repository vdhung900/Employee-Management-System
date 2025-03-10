import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { salaryService } from "../../services/salaryService";
import { employeeService } from "../../services/employeeService";

const SalaryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState({
    employeeId: "",
    salaryBase: 0,
    allowances: 0,
    bonus: 0,
    penalty: 0,
    paymentDate: new Date().toISOString().split('T')[0],
  });

  // Load danh sách nhân viên
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("An error occurred while loading employee list");
      }
    };
    fetchEmployees();
  }, []);

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    const fetchSalaryData = async () => {
      if (isEditing) {
        try {
          const response = await salaryService.getSalaryById(id);
          if (response.data.success) {
            const salaryData = response.data.data;
            setSalary({
              employeeId: salaryData.employeeId._id,
              salaryBase: salaryData.salaryBase,
              allowances: salaryData.allowances,
              bonus: salaryData.bonus,
              penalty: salaryData.penalty,
              paymentDate: salaryData.paymentDate ? new Date(salaryData.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            });
          }
        } catch (error) {
          console.error("Error fetching salary:", error);
          alert("An error occurred while loading salary information");
          navigate("/salaries");
        }
      }
    };
    fetchSalaryData();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalIncome = () => {
    const base = Number(salary.salaryBase) || 0;
    const allowances = Number(salary.allowances) || 0;
    const bonus = Number(salary.bonus) || 0;
    const penalty = Number(salary.penalty) || 0;
    return base + allowances + bonus - penalty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalIncome = calculateTotalIncome();
      const salaryData = {
        ...salary,
        totalIncome: totalIncome
      };

      if (isEditing) {
        await salaryService.updateSalary(id, salaryData);
        alert("Update successful!");
      } else {
        await salaryService.createSalary(salaryData);
        alert("Add new record successful!");
      }
      navigate("/salaries");
    } catch (error) {
      console.error("Error saving salary:", error);
      alert("An error occurred while saving salary information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={() => navigate("/salaries")}
            >
              <FaArrowLeft /> Back to List
            </Button>
            <h2 className="mb-0">
              {isEditing ? "Edit Salary Information" : "Add New Salary Record"}
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    name="employeeId"
                    value={salary.employeeId}
                    onChange={handleChange}
                    required
                    disabled={isEditing}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.fullName} - {emp.departmentId?.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="salaryBase"
                    value={salary.salaryBase}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Allowances</Form.Label>
                  <Form.Control
                    type="number"
                    name="allowances"
                    value={salary.allowances}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bonus</Form.Label>
                  <Form.Control
                    type="number"
                    name="bonus"
                    value={salary.bonus}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Penalty</Form.Label>
                  <Form.Control
                    type="number"
                    name="penalty"
                    value={salary.penalty}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={salary.paymentDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Income</Form.Label>
                  <Form.Control
                    type="text"
                    value={calculateTotalIncome().toLocaleString() + "đ"}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/salaries")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                <FaSave className="me-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalaryForm; 