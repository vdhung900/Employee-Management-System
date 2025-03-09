import React, { useContext, useState } from "react";

import { UserContext } from "../contexts/UserContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
const LoginScreeen = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await login(username, password);
      if (response) {
        setError(null);
        console.log("Login successful");
      } else {
        setError("Invalid credentials or server error");
      }
    } catch (error) {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Left Section - Form */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-center p-5"
        >
          <div className="d-flex align-items-center mb-4">
            <i
              className="fas fa-crow fa-3x me-3"
              style={{ color: "#709085" }}
            ></i>
            <span className="h1 fw-bold">Employee Management System</span>
          </div>

          <h3 className="fw-normal mb-3" style={{ letterSpacing: "1px" }}>
            Log in
          </h3>

          <Form className="w-75">
            <Form.Group controlId="email" className="mb-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                size="lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {error ? (
              <Alert key="danger" variant="danger">
                {error}
              </Alert>
            ) : (
              ""
            )}

            <Button
              variant="info"
              className="w-100 mb-4"
              size="lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {" "}
              {loading ? "Loading..." : "Login"}
            </Button>

            <p className="small">
              <a href="#!" className="text-muted">
                Forgot password?
              </a>
            </p>
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-info">
                Register here
              </a>
            </p>
          </Form>
        </Col>

        {/* Right Section - Image */}
        <Col md={6} className="d-none d-md-block p-0">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login"
            className="w-100 vh-100"
            style={{ objectFit: "cover", objectPosition: "left" }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreeen;
