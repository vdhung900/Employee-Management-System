import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Card,
} from 'react-bootstrap';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';

const MonthlyAttendanceReport = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // Lấy YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [reportData, setReportData] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchMonthlyReport();
  }, [selectedMonth]);

  const fetchEmployees = async () => {
    try {
    const res = await employeeService.getEmployees();
      const data = res.data.data;
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const { data } = await attendanceService.getMonthlyReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setReportData(data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    }
  };

  const calculateMonthlyStats = (employeeId) => {
    const employeeData = reportData.filter(record => record.employeeId._id === employeeId);
    const presentDays = employeeData.filter(record => record.status === 'present').length;
    const absentDays = employeeData.filter(record => record.status === 'absent').length;
    const leaveDays = employeeData.filter(record => record.status === 'leave').length;
    const totalOvertime = employeeData.reduce((sum, record) => sum + record.overtimeHours, 0);

    return {
      presentDays,
      absentDays,
      leaveDays,
      totalOvertime,
    };
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Báo cáo chấm công hàng tháng</Card.Title>
              <Form.Group className="mb-3">
                <Form.Label>Chọn tháng</Form.Label>
                <Form.Control
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Số ngày có mặt</th>
                    <th>Số ngày vắng mặt</th>
                    <th>Số ngày nghỉ phép</th>
                    <th>Tổng giờ làm thêm</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const stats = calculateMonthlyStats(employee._id);
                    return (
                      <tr key={employee._id}>
                        <td>{employee.fullName}</td>
                        <td>{stats.presentDays}</td>
                        <td>{stats.absentDays}</td>
                        <td>{stats.leaveDays}</td>
                        <td>{stats.totalOvertime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MonthlyAttendanceReport; 