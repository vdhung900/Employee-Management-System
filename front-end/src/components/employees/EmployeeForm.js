import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // Thêm state cho thông tin tài khoản
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  // Handle account information changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({
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

  const validateAccountInfo = () => {
    if (!accountInfo.username || !accountInfo.email || !accountInfo.password) {
      setError("Please fill in all account fields");
      return false;
    }

    if (accountInfo.password !== accountInfo.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Simple email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(accountInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Chuẩn bị dữ liệu trước khi gửi
      const formData = new FormData();

      // Xử lý các trường dữ liệu cơ bản
      const employeeData = {
        fullName: employee.fullName,
        dob: employee.dob,
        gender: employee.gender,
        address: employee.address,
        phone: employee.phone,
        departmentId: employee.departmentId || "", // Ensure empty string if not selected
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
        // If we're updating an employee and removing the department,
        // make sure to explicitly set departmentId to empty for the API
        if (employeeData.departmentId === "") {
          formData.append("departmentId", "");
        }

        await employeeService.updateEmployee(id, formData);
        navigate("/employees");
      } else {
        // Tạo mới employee
        // Nếu đang tạo mới và có thông tin tài khoản
        if (!validateAccountInfo()) {
          setLoading(false);
          return;
        }

        // Create employee
        const employeeResponse = await employeeService.createEmployee(formData);
        const newEmployeeId = employeeResponse.data.data._id;

        // Create user account
        const userResponse = await axios.post(
          "http://localhost:9999/api/auth/register",
          {
            username: accountInfo.username,
            email: accountInfo.email,
            password: accountInfo.password,
          }
        );

        // Link employee with user
        if (userResponse.status === 201) {
          // Get the user ID of the newly created user
          const usersResponse = await axios.get(
            "http://localhost:9999/api/users",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const newUser = usersResponse.data.find(
            (user) => user.username === accountInfo.username
          );

          if (newUser) {
            // Link the employee and user
            await axios.post(
              "http://localhost:9999/api/users/link-employee",
              {
                userId: newUser._id,
                employeeId: newEmployeeId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
          }
        }

        navigate("/employees");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      setError(
        error.response?.data?.message || "Error creating employee and account"
      );
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
          {error && <Alert variant="danger">{error}</Alert>}
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

                {!isEditing && (
                  <Card className="mt-4 mb-4">
                    <Card.Header>
                      <h4>Account Information</h4>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={accountInfo.username}
                          onChange={handleAccountChange}
                          required={!isEditing}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={accountInfo.email}
                          onChange={handleAccountChange}
                          required={!isEditing}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={accountInfo.password}
                              onChange={handleAccountChange}
                              required={!isEditing}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={accountInfo.confirmPassword}
                              onChange={handleAccountChange}
                              required={!isEditing}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>

                  {previewImage && (
                    <div className="mb-3">
                      <img
                        src={previewImage}
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
