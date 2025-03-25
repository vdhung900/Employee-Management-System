import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Pagination,
  Badge,
  Alert,
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { getUserActivities } from "../../services/activityLogService";
import ActivityLogDetails from "./ActivityLogDetails";
import moment from "moment";

const UserActivityLogs = ({ userId, onBack }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserActivities();
  }, [userId, currentPage]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      const response = await getUserActivities(userId, params);
      setActivities(response.data.activities);
      setTotalPages(response.data.totalPages);

      // Lấy tên người dùng từ kết quả
      if (
        response.data.activities.length > 0 &&
        response.data.activities[0].userId
      ) {
        setUserName(
          response.data.activities[0].userId.username || "Người dùng"
        );
      }

      setLoading(false);
    } catch (err) {
      setError("Không thể tải lịch sử hoạt động của người dùng.");
      setLoading(false);
    }
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

  return (
    <Container fluid>
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-primary" className="me-3" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="mb-0">Lịch sử hoạt động của {userName}</h2>
      </div>

      {/* Activity Log Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Card>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                    <th>Đối tượng</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    activities.map((log) => (
                      <tr key={log._id}>
                        <td>
                          {moment(log.timestamp).format("DD/MM/YYYY HH:mm:ss")}
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

export default UserActivityLogs;
