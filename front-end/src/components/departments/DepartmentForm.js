import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { departmentService } from "../../services/departmentService";

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchDepartment();
    }
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const response = await departmentService.getDepartment(id);
      if (response.data.success) {
        const { name, description } = response.data.data;
        setDepartment({ name, description });
      }
    } catch (error) {
      console.error("Error fetching department:", error);
      alert("An error occurred while loading department information");
      navigate("/departments");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await departmentService.updateDepartment(id, department);
        alert("Department updated successfully");
      } else {
        await departmentService.createDepartment(department);
        alert("Department created successfully");
      }
      navigate("/departments");
    } catch (error) {
      console.error("Error saving department:", error);
      alert("An error occurred while saving department");
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
              onClick={() => navigate("/departments")}
            >
              <FaArrowLeft /> Back to List
            </Button>
            <h2 className="mb-0">
              {isEditing ? "Edit Department" : "Add New Department"}
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={department.name}
                onChange={handleChange}
                required
                placeholder="Enter department name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={department.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter department description"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/departments")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
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

export default DepartmentForm; 