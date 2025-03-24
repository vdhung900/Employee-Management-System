import React, { useState } from 'react';
import {
  Container,
  Nav,
  Tab,
  Card,
} from 'react-bootstrap';
import AttendanceSheet from './AttendanceSheet';
import MonthlyAttendanceReport from './MonthlyAttendanceReport';

const AttendancePage = () => {
  const [key, setKey] = useState('sheet');

  return (
    <Container fluid className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">Quản lý chấm công</Card.Title>
          <Tab.Container id="attendance-tabs" activeKey={key} onSelect={setKey}>
            <Nav variant="pills" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="sheet">Bảng chấm công</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="report">Báo cáo hàng tháng</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="sheet">
                <AttendanceSheet />
              </Tab.Pane>
              <Tab.Pane eventKey="report">
                <MonthlyAttendanceReport />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AttendancePage; 