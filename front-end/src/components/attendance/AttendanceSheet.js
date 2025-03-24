import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Card,
  Button,
  Modal,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faBed,
  faMinus,
  faStar,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { 
  getAllAttendances, 
  getMonthlyReport, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance 
} from '../../services/attendanceService';
import { getEmployees } from '../../services/employeeService';
import './AttendanceSheet.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const AttendanceSheet = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addType, setAddType] = useState('single'); // 'single' hoặc 'multiple'

  const months = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceData();
  }, [selectedYear, selectedMonth]);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      const data = res.data.data;
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const startDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1);
      const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0);
      
      const response = await getMonthlyReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Lỗi khi tải dữ liệu chấm công');
    }
  };

  const getDaysInMonth = () => {
    return new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
  };

  const getAttendanceStatus = (employeeId, day) => {
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, day);
    const attendance = attendanceData.find(
      a => 
        a.employeeId._id === employeeId && 
        new Date(a.date).toDateString() === date.toDateString()
    );

    if (!attendance) {
        return isWeekend(day) ? 'weekend' : 'not_found';
      }
    
    switch (attendance.status) {
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      case 'leave':
        return 'leave';
      default:
        return 'weekend';
    }
  };

  const isWeekend = (day) => {
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FontAwesomeIcon icon={faCheck} />;
      case 'absent':
        return <FontAwesomeIcon icon={faTimes} />;
      case 'leave':
        return <FontAwesomeIcon icon={faBed} />;
      case 'weekend':
        return <FontAwesomeIcon icon={faMinus} />;
      case 'not_found':
        return '';
      default:
        return '';
    }
  };

  const handleSearch = () => {
    fetchAttendanceData();
  };

  const handleShowModal = () => {
    setShowModal(true);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setStartDate(today);
    setEndDate(today);
    setAddType('single');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee('');
    setSelectedDate('');
    setStartDate('');
    setEndDate('');
    setSelectedStatus('present');
    setAddType('single');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAttendance(null);
    setSelectedStatus('present');
  };

  const handleAttendanceClick = (employee, day) => {
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, day);
    const attendance = attendanceData.find(
      a => 
        a.employeeId._id === employee._id && 
        new Date(a.date).toDateString() === date.toDateString()
    );

    if (attendance && !isWeekend(day)) {
      setSelectedAttendance(attendance);
      setSelectedStatus(attendance.status);
      setShowEditModal(true);
    }
  };

  const handleUpdateAttendance = async () => {
    try {
      if (!selectedAttendance) {
        toast.error('Không tìm thấy thông tin chấm công');
        return;
      }

      await updateAttendance(selectedAttendance._id, {
        status: selectedStatus
      });
      toast.success('Cập nhật chấm công thành công');
      handleCloseEditModal();
      fetchAttendanceData();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Lỗi khi cập nhật chấm công');
    }
  };

  const handleDeleteAttendance = async () => {
    try {
      if (!selectedAttendance) {
        toast.error('Không tìm thấy thông tin chấm công');
        return;
      }

      await deleteAttendance(selectedAttendance._id);
      toast.success('Xóa chấm công thành công');
      handleCloseEditModal();
      fetchAttendanceData();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Lỗi khi xóa chấm công');
    }
  };

  const handleAddAttendance = async () => {
    try {
      if (!selectedEmployee) {
        toast.error('Vui lòng chọn nhân viên');
        return;
      }

      setIsLoading(true);

      if (addType === 'single') {
        if (!selectedDate) {
          toast.error('Vui lòng chọn ngày');
          return;
        }

        await createAttendance({
          employeeId: selectedEmployee,
          date: selectedDate,
          status: selectedStatus,
        });
      } else {
        if (!startDate || !endDate) {
          toast.error('Vui lòng chọn ngày bắt đầu và kết thúc');
          return;
        }
        if (new Date(endDate) < new Date(startDate)) {
          toast.error('Ngày kết thúc không thể trước ngày bắt đầu');
          return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const promises = [];

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            promises.push(
              createAttendance({
                employeeId: selectedEmployee,
                date: new Date(date).toISOString(),
                status: selectedStatus,
              })
            );
          }
        }

        await Promise.all(promises);
      }

      toast.success('Thêm chấm công thành công');
      handleCloseModal();
      fetchAttendanceData();
    } catch (error) {
      console.error('Error adding attendance:', error);
      toast.error('Lỗi khi thêm chấm công');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Bảng chấm công</Card.Title>
            <Button variant="success" onClick={handleShowModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm chấm công
            </Button>
          </div>
          <Row className="align-items-end mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Chọn năm</Form.Label>
                <Form.Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Chọn tháng</Form.Label>
                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </Col>
          </Row>

          <div className="attendance-legend mb-3">
            <span className="legend-item">
              <span className="status-icon weekend">
                <FontAwesomeIcon icon={faMinus} />
              </span> 
              Cuối tuần
            </span>
            <span className="legend-item">
              <span className="status-icon present">
                <FontAwesomeIcon icon={faCheck} />
              </span> 
              Có mặt
            </span>
            <span className="legend-item">
              <span className="status-icon leave">
                <FontAwesomeIcon icon={faBed} />
              </span> 
              Nghỉ phép
            </span>
            <span className="legend-item">
              <span className="status-icon absent">
                <FontAwesomeIcon icon={faTimes} />
              </span> 
              Vắng mặt
            </span>
          </div>

          <div className="table-responsive">
            <Table bordered className="attendance-table">
              <thead>
                <tr>
                  <th className="name-column">Nhân viên</th>
                  {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map(day => (
                    <th key={day} className={isWeekend(day) ? 'weekend' : ''}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee._id}>
                    <td className="name-column">
                      <div className="employee-info">
                        <img 
                          src={employee.avatar || '/avatar.jpg'} 
                          alt={employee.fullName}
                          className="employee-avatar"
                        />
                        <span>{employee.fullName}</span>
                      </div>
                    </td>
                    {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map(day => {
                      const status = getAttendanceStatus(employee._id, day);
                      return (
                        <td 
                          key={day}
                          className={`status-cell ${status} ${status !== 'weekend' && status !== 'not_found' ? 'clickable' : ''}`}
                          onClick={() => handleAttendanceClick(employee, day)}
                        >
                          <div className="d-flex justify-content-center">
                            {getStatusIcon(status)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm chấm công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nhân viên</Form.Label>
              <Form.Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Chọn nhân viên</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.fullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kiểu thêm chấm công</Form.Label>
              <Form.Select
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
              >
                <option value="single">Thêm một ngày</option>
                <option value="multiple">Thêm nhiều ngày</option>
              </Form.Select>
            </Form.Group>

            {addType === 'single' ? (
              <Form.Group className="mb-3">
                <Form.Label>Ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Lưu ý: Hệ thống sẽ tự động bỏ qua các ngày cuối tuần
                  </Form.Text>
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="present">Có mặt</option>
                <option value="absent">Vắng mặt</option>
                <option value="leave">Nghỉ phép</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddAttendance}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật chấm công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="present">Có mặt</option>
                <option value="absent">Vắng mặt</option>
                <option value="leave">Nghỉ phép</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateAttendance}>
            Cập nhật
          </Button>
          <Button variant="danger" onClick={handleDeleteAttendance}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default AttendanceSheet; 