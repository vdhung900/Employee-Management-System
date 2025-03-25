import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  ButtonGroup,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faBed,
  faCalendarPlus,
  faPencilAlt,
  faTrash,
  faCalendarDay,
  faClock,
  faUserClock,
  faCircleCheck,
  faHourglassHalf,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { 
  getEmployeeAttendance, 
  createAttendance,
  deleteAttendance
} from '../../services/attendanceService';
import userService from '../../services/userService';
import useRoleCheck from '../../hooks/useRoleCheck';

const UserAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [monthlyStats, setMonthlyStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    weekendDays: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Sử dụng hook để lấy thông tin người dùng
  const { userData, loading: userLoading, error: userError } = useRoleCheck();

  useEffect(() => {
    const loadData = async () => {
      await fetchUserInfo();
      await fetchAttendanceData();
    };
    loadData();
  }, [refreshKey, selectedMonth, selectedYear]);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserProfile();
      if (response && response.data) {
        setUserInfo(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      toast.error('Lỗi khi tải thông tin người dùng');
      return null;
    }
  };

  const generateAllDaysInMonth = (existingAttendance) => {
    const year = selectedYear;
    const month = selectedMonth;
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let weekendCount = 0;
    
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      const existingRecord = Array.isArray(existingAttendance) ? 
        existingAttendance.find(att => {
          if (!att || !att.date) return false;
          const attDate = new Date(att.date);
          return attDate.getDate() === day && 
                 attDate.getMonth() === month && 
                 attDate.getFullYear() === year;
        }) : null;

      if (existingRecord && existingRecord._id) {
        days.push(existingRecord);
        
        if (existingRecord.status === 'present') presentCount++;
        else if (existingRecord.status === 'absent') absentCount++;
        else if (existingRecord.status === 'leave') leaveCount++;
      } else {
        if (isWeekend) {
          days.push({
            date: date,
            status: 'weekend',
            overtime: '-',
            shift: 1,
            _id: `generated-${dateString}`,
            isGenerated: true
          });
          weekendCount++;
        } else {
          days.push({
            date: date,
            status: 'empty',
            overtime: '-',
            shift: '-',
            _id: `generated-${dateString}`,
            isGenerated: true
          });
        }
      }
    }

    setMonthlyStats({
      totalDays: lastDay,
      presentDays: presentCount,
      absentDays: absentCount,
      leaveDays: leaveCount,
      weekendDays: weekendCount
    });
    
    return days;
  };

  const fetchAttendanceData = async () => {
    try {
      const userInfo = await userService.getUserProfile();
      const response = await getEmployeeAttendance(userInfo.employeeId._id);
      
      if (!response || !response.data) {
        throw new Error('Không có dữ liệu chấm công');
      }
      
      // Lọc dữ liệu theo tháng và năm đã chọn
      const filteredData = response.data.filter(item => {
        if (!item || !item.date) return false;
        const date = new Date(item.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });
      
      // Tạo danh sách đầy đủ các ngày và kết hợp với dữ liệu chấm công
      const allDays = generateAllDaysInMonth(filteredData);
      
      // Cập nhật state
      setAttendanceData(allDays);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Lỗi khi tải dữ liệu chấm công');
      
      // Nếu có lỗi, hiển thị danh sách mặc định
      const defaultDays = generateAllDaysInMonth([]);
      setAttendanceData(defaultDays);
    }
  };

  const handleShowModal = () => {
    const currentDate = new Date();
    // Đặt ngày mặc định là ngày hôm nay nếu là tháng hiện tại, nếu không thì là ngày 1 của tháng đã chọn
    if (selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear()) {
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    } else {
      const defaultDate = new Date(selectedYear, selectedMonth, 1);
      setSelectedDate(defaultDate.toISOString().split('T')[0]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate('');
    setSelectedStatus('present');
  };

  const handleAddAttendance = async () => {
    try {
      if (!selectedDate) {
        toast.error('Vui lòng chọn ngày');
        return;
      }

      const selectedDateObj = new Date(selectedDate);
      const existingAttendance = attendanceData.find(att => {
        if (!att || !att.date) return false;
        const attDate = new Date(att.date);
        return attDate.getDate() === selectedDateObj.getDate() && 
               attDate.getMonth() === selectedDateObj.getMonth() && 
               attDate.getFullYear() === selectedDateObj.getFullYear() &&
               !att.isGenerated;
      });

      if (existingAttendance && !existingAttendance.isGenerated) {
        toast.warning('Đã có dữ liệu chấm công cho ngày này, vui lòng cập nhật thay vì thêm mới');
        return;
      }

      setIsLoading(true);
      const userInfo = await userService.getUserProfile();

      await createAttendance({
        employeeId: userInfo.employeeId._id,
        date: selectedDate,
        status: selectedStatus,
      });

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

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderStatus = (attendance) => {
    if (attendance.status === 'present') {
      return (
        <Badge bg="success">
          <FontAwesomeIcon icon={faCheck} className="me-1" /> Có mặt
        </Badge>
      );
    } else if (attendance.status === 'absent') {
      return (
        <Badge bg="danger">
          <FontAwesomeIcon icon={faTimes} className="me-1" /> Vắng mặt
        </Badge>
      );
    } else if (attendance.status === 'leave') {
      return (
        <Badge bg="warning">
          <FontAwesomeIcon icon={faBed} className="me-1" /> Nghỉ phép
        </Badge>
      );
    } else if (attendance.status === 'weekend') {
      return (
        <Badge bg="info">
          <FontAwesomeIcon icon={faCalendarDay} className="me-1" /> Cuối tuần
        </Badge>
      );
    } else {
      return null;
    }
  };

  // Lấy tên tháng dạng tiếng Việt
  const getMonthName = (month) => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return monthNames[month];
  };

  if (userLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (userError) {
    return (
      <Container className="py-3">
        <Alert variant="danger">
          Lỗi: {userError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>
                  <FontAwesomeIcon icon={faUserClock} className="me-2" />
                  Thông tin chấm công {getMonthName(selectedMonth)} {selectedYear}
                </Card.Title>
                <ButtonGroup>
                  <Button variant="outline-secondary" onClick={handlePreviousMonth}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Button>
                  <Button variant="outline-primary" onClick={() => {
                    setSelectedMonth(new Date().getMonth());
                    setSelectedYear(new Date().getFullYear());
                  }}>
                    Tháng hiện tại
                  </Button>
                  <Button variant="outline-secondary" onClick={handleNextMonth}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </ButtonGroup>
              </div>
              
              <Row>
                <Col md={3}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>
                        <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                        Tổng số ngày
                      </h6>
                      <h3>{monthlyStats.totalDays}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-success text-white">
                    <Card.Body>
                      <h6>
                        <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                        Có mặt
                      </h6>
                      <h3>{monthlyStats.presentDays}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-danger text-white">
                    <Card.Body>
                      <h6>
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Vắng mặt
                      </h6>
                      <h3>{monthlyStats.absentDays}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-warning">
                    <Card.Body>
                      <h6>
                        <FontAwesomeIcon icon={faBed} className="me-2" />
                        Nghỉ phép
                      </h6>
                      <h3>{monthlyStats.leaveDays}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>
                  <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                  Lịch sử chấm công
                </Card.Title>
                <Button variant="primary" onClick={handleShowModal}>
                  <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                  Thêm chấm công
                </Button>
              </div>
              <Table responsive striped bordered hover className="align-middle">
                <thead>
                  <tr className="text-center">
                    <th>
                      <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                      Ngày
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faHourglassHalf} className="me-2" />
                      Overtime
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faClock} className="me-2" />
                      Shift
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(attendanceData) && attendanceData.map((attendance) => (
                    <tr key={attendance._id || `row-${attendance.date}`} className="text-center">
                      <td>
                        {attendance.date instanceof Date ? 
                          attendance.date.toLocaleDateString('vi-VN') : 
                          new Date(attendance.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        {attendance.overtime || "-"}
                      </td>
                      <td>
                        {attendance.shift || "-"}
                      </td>
                      <td>
                        {renderStatus(attendance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chấm công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ngày</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>

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
    </Container>
  );
};

export default UserAttendance; 