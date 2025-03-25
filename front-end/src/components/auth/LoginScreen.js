import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log("Đang gửi yêu cầu đăng nhập cho:", username);
      const response = await axios.post(
        "http://localhost:9999/api/auth/login",
        {
          username,
          password,
        }
      );
      
      // Thêm debug
      console.log("Đăng nhập thành công, response:", response.data);
      console.log("Access token:", response.data.accessToken);
      
      login(response.data.accessToken);
      
      // Thêm debug xác nhận token đã được lưu
      console.log("Token đã được lưu vào localStorage:", localStorage.getItem('token'));
      
      navigate("/home");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
        setError(error.response.data.message || 'Đăng nhập thất bại');
      } else {
        setError('Lỗi kết nối đến server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link to="/register">Register here</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
