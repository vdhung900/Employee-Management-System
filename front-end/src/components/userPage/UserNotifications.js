import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Spinner, Pagination, Form, InputGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faFilter, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { notificationService } from '../../services/notificationService';
import useRoleCheck from '../../hooks/useRoleCheck';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTarget, setFilterTarget] = useState('all'); // 'all', 'department'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  const { userData } = useRoleCheck();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [userData]);

  // Lọc thông báo khi thay đổi trang, bộ lọc, hoặc hướng sắp xếp
  useEffect(() => {
    if (allNotifications.length > 0) {
      applyFiltersAndPagination();
    }
  }, [activePage, filterTarget, sortDirection, searchTerm, allNotifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      if (!userData || !userData._id) {
        console.log('Chưa có dữ liệu người dùng');
        return;
      }

      // Sử dụng notificationService để lấy tất cả thông báo
      const response = await notificationService.getAllNotifications();
      console.log("Dữ liệu thông báo:", response.data);
      
      if (response && response.data) {
        const allNotifications = response.data.data || [];
        
        // Lọc thông báo dành cho tất cả hoặc phòng ban của nhân viên
        const userNotifications = allNotifications.filter(notification => {
          // Thông báo cho tất cả người dùng
          if (notification.target === 'all') return true;
          // Thông báo cho phòng ban của nhân viên
          if (notification.target === 'department' && 
              userData.employeeId && 
              userData.employeeId.departmentId && 
              notification.departmentId && 
              notification.departmentId._id === userData.employeeId.departmentId._id) {
            return true;
          }
          
          return false;
        });
        
        setAllNotifications(userNotifications);
        
        // Tổng số trang sẽ được tính lại trong applyFiltersAndPagination
        setError(null);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông báo:', err);
      setError('Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm áp dụng bộ lọc và phân trang
  const applyFiltersAndPagination = () => {
    // Bước 1: Lọc theo trạng thái đã đọc/chưa đọc
    let filteredNotifications = [...allNotifications];
    
    // Áp dụng lọc theo loại thông báo (tất cả/phòng ban/cá nhân)
    if (filterTarget !== 'all') {
      filteredNotifications = filteredNotifications.filter(
        notification => notification.target === filterTarget
      );
    }
    
    // Bước 2: Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredNotifications = filteredNotifications.filter(
        notification => 
          (notification.title && notification.title.toLowerCase().includes(searchLower)) ||
          (notification.content && notification.content.toLowerCase().includes(searchLower))
      );
    }
    
    // Bước 3: Sắp xếp thông báo
    filteredNotifications.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    // Bước 4: Tính tổng số trang
    const total = filteredNotifications.length;
    setTotalPages(Math.ceil(total / itemsPerPage) || 1);
    
    // Bước 5: Lấy dữ liệu cho trang hiện tại
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setNotifications(filteredNotifications.slice(startIndex, endIndex));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActivePage(1);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Xử lý phân trang
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const renderPagination = () => {
    let items = [];
    
    // Nút previous
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={activePage === 1}
        onClick={() => handlePageChange(activePage - 1)}
      />
    );
    
    // Hiển thị các trang
    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 || 
        number === totalPages || 
        (number >= activePage - 1 && number <= activePage + 1)
      ) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === activePage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (
        (number === activePage - 2 && activePage > 3) || 
        (number === activePage + 2 && activePage < totalPages - 2)
      ) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
      }
    }
    
    // Nút next
    items.push(
      <Pagination.Next
        key="next"
        disabled={activePage === totalPages}
        onClick={() => handlePageChange(activePage + 1)}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  // Hiển thị nhãn cho loại thông báo
  const getTargetBadge = (target) => {
    switch (target) {
      case 'all':
        return <Badge bg="success">Tất cả</Badge>;
      case 'department':
        return <Badge bg="info">Phòng ban</Badge>;
      default:
        return null;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Container className="mt-4 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Thông báo của bạn
          </h4>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-primary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            
            <Col md={3}>

            </Col>
            
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faFilter} />
                </InputGroup.Text>
                <Form.Select
                  value={filterTarget}
                  onChange={(e) => setFilterTarget(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="department">Phòng ban</option>
                </Form.Select>
              </InputGroup>
            </Col>
            
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
              >
                <FontAwesomeIcon 
                  icon={sortDirection === 'desc' ? faSortAmountDown : faSortAmountUp} 
                  className="me-2" 
                />
                {sortDirection === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
              </Button>
            </Col>
          </Row>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {notifications.length === 0 ? (
            <Alert variant="info">Bạn không có thông báo nào</Alert>
          ) : (
            <>
              {notifications.map((notification) => (
                <Card 
                  key={notification._id} 
                  className={`mb-3 ${!notification.read ? 'border-primary' : ''}`}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <Card.Title className="mb-0 me-2">{notification.title}</Card.Title>
                          {getTargetBadge(notification.target)}
                          {!notification.read && <Badge bg="warning" className="ms-2">Mới</Badge>}
                        </div>
                        <Card.Text>{notification.content}</Card.Text>
                        <small className="text-muted">
                          {formatDate(notification.createdAt)}
                        </small>
                        {notification.sender && (
                          <small className="text-muted ms-2">
                            Từ: {notification.sender.fullName || notification.sender.username}
                          </small>
                        )}
                        {notification.departmentId && notification.departmentId.name && (
                          <small className="text-muted ms-2">
                            Phòng ban: {notification.departmentId.name}
                          </small>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              
              <div className="d-flex justify-content-center mt-4">
                {renderPagination()}
              </div>
            </>
          )}
          
          {loading && notifications.length > 0 && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" variant="primary" />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserNotifications; 