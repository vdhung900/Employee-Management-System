import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LoginScreeen from "./components/LoginScreen";
import TopBar from "./components/TopBar";
import Home from "./components/Home";
import Sidebar from "./components/SideBar";
import { Container } from "react-bootstrap";

function App() {
  const user = {
    name: "Nguyễn Văn A",
    avatar: "avatar.jpg",
  };

  return (
    <>
      <UserProvider>
          <Router>
            <Container >
                <div className="d-flex flex-row">
                  <Sidebar className="mt-5"></Sidebar>
                  <div className="w-100 d-flex flex-column">
                    <TopBar user={user} className="" />
                    <Routes>
                      <Route path="/login" element={<LoginScreeen />} />
                      
                      <Route path="/home" element={<Home />} />
                      <Route path="/employees" element={<Home />} />
                    </Routes>
                  </div>
                </div>
            </Container>
          </Router>
      </UserProvider>
    </>
  );
}

export default App;
