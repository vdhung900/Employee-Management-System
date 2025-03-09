import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";
import { FaArrowLeft } from "react-icons/fa";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    departmentId: "",
    position: "",
    salaryBase: "",
    startDate: "",
    avatar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (isEditing) {
      fetchEmployee();
    }
    fetchDepartments();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployee(id);
      const employeeData = response.data.data;

      // Format dates for form inputs
      const formattedEmployee = {
        ...employeeData,
        departmentId: employeeData.departmentId?._id || "",
        dob: employeeData.dob
          ? new Date(employeeData.dob).toISOString().split("T")[0]
          : "",
        startDate: employeeData.startDate
          ? new Date(employeeData.startDate).toISOString().split("T")[0]
          : "",
      };

      setEmployee(formattedEmployee);

      if (employeeData.avatar) {
        setPreviewImage(`http://localhost:9999/${employeeData.avatar}`);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee((prev) => ({
        ...prev,
        avatar: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu trước khi gửi
      const formData = new FormData();

      // Xử lý các trường dữ liệu cơ bản
      const employeeData = {
        fullName: employee.fullName,
        dob: employee.dob,
        gender: employee.gender,
        address: employee.address,
        phone: employee.phone,
        departmentId: employee.departmentId,
        position: employee.position,
        salaryBase: Number(employee.salaryBase), // Chuyển đổi sang số
        startDate: employee.startDate,
      };

      // Thêm các trường dữ liệu vào FormData
      Object.keys(employeeData).forEach((key) => {
        if (
          employeeData[key] !== null &&
          employeeData[key] !== undefined &&
          employeeData[key] !== ""
        ) {
          formData.append(key, employeeData[key]);
        }
      });

      // Xử lý file ảnh nếu có
      if (employee.avatar instanceof File) {
        formData.append("avatar", employee.avatar);
      }

      if (isEditing) {
        await employeeService.updateEmployee(id, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      // Thêm xử lý hiển thị lỗi nếu cần
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center">Loading...</div>;
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
            <h2 className="mb-0">
              {isEditing ? "Edit Employee" : "Add New Employee"}
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={employee.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={employee.dob || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={employee.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={employee.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={employee.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="departmentId"
                        value={employee.departmentId || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position</Form.Label>
                      <Form.Select
                        name="position"
                        value={employee.position}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Position</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
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
                        value={employee.salaryBase || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={employee.startDate || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>

                  {employee.avatar && (
                    <div className="mb-3">
                      <img
                        src={`http://localhost:9999/${employee.avatar}`}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px" }}
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={() => navigate("/employees")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Employee"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeForm;
