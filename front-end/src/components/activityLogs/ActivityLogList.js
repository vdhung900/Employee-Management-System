import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
  Button,
  Pagination,
  Badge,
} from "react-bootstrap";
import { getAllActivities } from "../../services/activityLogService";
import { useAuth } from "../../contexts/AuthContext";
import ActivityLogDetails from "./ActivityLogDetails";
import UserActivityLogs from "./UserActivityLogs";
import moment from "moment";

const ActivityLogList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState({
    entityType: "",
    limit: 10,
  });
  const { auth } = useAuth();
  const [showUserLogs, setShowUserLogs] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [currentPage, filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: filter.limit,
        ...(filter.entityType && { entityType: filter.entityType }),
      };

      const response = await getAllActivities(params);
      setActivities(response.data.activities);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải lịch sử hoạt động.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
  };

  const closeDetails = () => {
    setSelectedLog(null);
  };

  const viewUserLogs = (userId) => {
    setSelectedUserId(userId);
    setShowUserLogs(true);
  };

  const closeUserLogs = () => {
    setShowUserLogs(false);
    setSelectedUserId(null);
  };

  // Render badge cho loại hành động
  const getActionBadge = (action) => {
    switch (action) {
      case "CREATE":
        return <Badge bg="success">Tạo mới</Badge>;
      case "UPDATE":
        return <Badge bg="warning">Cập nhật</Badge>;
      case "DELETE":
        return <Badge bg="danger">Xóa</Badge>;
      default:
        return <Badge bg="secondary">{action}</Badge>;
    }
  };

  // Render tên loại đối tượng
  const getEntityTypeName = (type) => {
    switch (type) {
      case "EMPLOYEE":
        return "Nhân viên";
      case "DEPARTMENT":
        return "Phòng ban";
      case "SALARY":
        return "Lương thưởng";
      case "ATTENDANCE":
        return "Chấm công";
      case "LEAVE_REQUEST":
        return "Nghỉ phép";
      default:
        return type;
    }
  };

  // Xây dựng phân trang
  const paginationItems = [];
  for (let page = 1; page <= totalPages; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  if (showUserLogs && selectedUserId) {
    return <UserActivityLogs userId={selectedUserId} onBack={closeUserLogs} />;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Lịch sử hoạt động</h2>

      {/* Filter options */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Loại đối tượng</Form.Label>
                <Form.Select
                  name="entityType"
                  value={filter.entityType}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="EMPLOYEE">Nhân viên</option>
                  <option value="DEPARTMENT">Phòng ban</option>
                  <option value="SALARY">Lương thưởng</option>
                  <option value="ATTENDANCE">Chấm công</option>
                  <option value="LEAVE_REQUEST">Nghỉ phép</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Số bản ghi mỗi trang</Form.Label>
                <Form.Select
                  name="limit"
                  value={filter.limit}
                  onChange={handleFilterChange}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Activity Log Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <Card>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người dùng</th>
                    <th>Hành động</th>
                    <th>Đối tượng</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    activities.map((log) => (
                      <tr key={log._id}>
                        <td>
                          {moment(log.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                        </td>
                        <td>
                          <Button
                            variant="link"
                            onClick={() => viewUserLogs(log.userId._id)}
                          >
                            {log.userId.username}
                          </Button>
                        </td>
                        <td>{getActionBadge(log.action)}</td>
                        <td>{getEntityTypeName(log.entityType)}</td>
                        <td>{log.description}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => viewLogDetails(log)}
                          >
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {paginationItems}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}

      {/* Activity Log Details Modal */}
      {selectedLog && (
        <ActivityLogDetails log={selectedLog} onClose={closeDetails} />
      )}
    </Container>
  );
};

export default ActivityLogList;
