import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

const IMAGE_URL = "http://localhost:9999/";

const TopBar = ({ user }) => {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response) {
          setUserState(response);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    getUser();
  }, []);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // if (user == null) {
  //   user = {
  //     name: "Guest",
  //     avatar: "/avatar.jpg",
  //   };
  // }

  const handleLogout = () => {
    logout();
    // Clear all localStorage data
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="align-items-center">
          <NavLink href="/notifications">
            <BellFill className="fs-3" />
          </NavLink>

          <NavDropdown
            title={
              <>
                <span className="me-2">{userState?.username}</span>
                <img
                  src={userState?.avatar ? IMAGE_URL + userState?.avatar : "/avatar.jpg"}
                  alt="Avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </>
            }
            id="user-dropdown"
          >
            <NavDropdown.Item href="#action/3.1">{user?.name}</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopBar;
