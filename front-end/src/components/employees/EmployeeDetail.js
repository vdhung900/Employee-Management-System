import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state?.employee;

  if (!employee) {
    return <div className="text-center">Employee not found</div>;
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={() => navigate("/employees")}
            >
              <FaArrowLeft /> Back to List
            </Button>
            <h2 className="mb-0">Employee Details</h2>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate(`/employees/${employee._id}/edit`)}
          >
            <FaEdit /> Edit Employee
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-4">
              <img
                src={"/avatar.jpg"}
                alt={employee.fullName}
                className="img-thumbnail mb-3"
                style={{ maxWidth: "200px" }}
              />
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <dl>
                    <dt>Full Name</dt>
                    <dd>{employee.fullName}</dd>

                    <dt>Date of Birth</dt>
                    <dd>{new Date(employee.dob).toLocaleDateString()}</dd>

                    <dt>Gender</dt>
                    <dd>{employee.gender}</dd>

                    <dt>Phone Number</dt>
                    <dd>{employee.phone}</dd>

                    <dt>Address</dt>
                    <dd>{employee.address}</dd>
                  </dl>
                </Col>
                <Col md={6}>
                  <dl>
                    <dt>Department</dt>
                    <dd>{employee.departmentId?.name}</dd>

                    <dt>Position</dt>
                    <dd>{employee.position}</dd>

                    <dt>Salary</dt>
                    <dd>${employee.salaryBase?.toLocaleString()}</dd>

                    <dt>Start Date</dt>
                    <dd>{new Date(employee.startDate).toLocaleDateString()}</dd>

                    <dt>Employment Duration</dt>
                    <dd>
                      {(() => {
                        const start = new Date(employee.startDate);
                        const now = new Date();
                        const years = now.getFullYear() - start.getFullYear();
                        const months = now.getMonth() - start.getMonth();
                        const totalMonths = years * 12 + months;

                        if (totalMonths < 12) {
                          return `${totalMonths} months`;
                        }
                        const remainingMonths = totalMonths % 12;
                        return `${Math.floor(totalMonths / 12)} years${
                          remainingMonths ? ` ${remainingMonths} months` : ""
                        }`;
                      })()}
                    </dd>
                  </dl>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeDetail;
