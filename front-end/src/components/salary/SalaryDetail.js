import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { salaryService } from "../../services/salaryService";

const SalaryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryDetail = async () => {
      try {
        const response = await salaryService.getSalaryById(id);
        if (response.data.success) {
          setSalary(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching salary:", error);
        alert("An error occurred while loading salary information");
        navigate("/salaries");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryDetail();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!salary) {
    return <div className="text-center">Salary record not found</div>;
  }

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
            <h2 className="mb-0">Salary Details</h2>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate(`/salaries/${id}/edit`)}
          >
            <FaEdit className="me-2" />
            Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>Employee Information</h4>
              <div className="mb-3">
                <strong>Name:</strong> {salary.employeeId?.fullName || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Department:</strong> {salary.employeeId?.departmentId?.name || "N/A"}
              </div>
            </Col>
            <Col md={6}>
              <h4>Payment Information</h4>
              <div className="mb-3">
                <strong>Payment Date:</strong>{" "}
                {new Date(salary.paymentDate).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <strong>Month/Year:</strong>{" "}
                {new Date(salary.paymentDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <h4>Salary Components</h4>
              <div className="mb-3">
                <strong>Base Salary:</strong>{" "}
                {salary.salaryBase.toLocaleString()}đ
              </div>
              <div className="mb-3">
                <strong>Allowances:</strong>{" "}
                {salary.allowances.toLocaleString()}đ
              </div>
              <div className="mb-3">
                <strong>Bonus:</strong> {salary.bonus.toLocaleString()}đ
              </div>
              <div className="mb-3">
                <strong>Penalty:</strong> {salary.penalty.toLocaleString()}đ
              </div>
            </Col>
            <Col md={6}>
              <h4>Summary</h4>
              <div className="mb-3">
                <strong>Total Income:</strong>{" "}
                {salary.totalIncome.toLocaleString()}đ
              </div>
              <div className="mb-3">
                <strong>Created At:</strong>{" "}
                {new Date(salary.createdAt).toLocaleString()}
              </div>
              <div className="mb-3">
                <strong>Last Updated:</strong>{" "}
                {new Date(salary.updatedAt).toLocaleString()}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalaryDetail; 