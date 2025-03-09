import React from "react";
import { Navbar, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";

const TopBar = ({ user }) => {
  if (user == null) {
    user = {
      name: "Guest",
      avatar: "/avatar.jpg",
    };
  }

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
                <span className="me-2">{user.name}</span>
                <img
                  src={user?.avatar}
                  alt="Avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </>
            }
            id="user-dropdown"
          >
            <NavDropdown.Item href="#action/3.1">{user?.name}</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Đăng xuất</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopBar;
