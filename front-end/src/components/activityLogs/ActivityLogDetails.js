import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import moment from "moment";

const ActivityLogDetails = ({ log, onClose }) => {
  if (!log) return null;

  // Chuyển đổi details từ object thành danh sách hiển thị
  const renderDetails = () => {
    if (!log.details) return <p>Không có thông tin chi tiết</p>;

    try {
      // Hiển thị thông tin theo cấu trúc
      return (
        <div className="details-container">
          {Object.entries(log.details).map(([key, value]) => {
            if (value && typeof value === "object") {
              return (
                <div key={key} className="nested-details mb-3">
                  <h6 className="text-primary">{key}:</h6>
                  <pre className="bg-light p-2 rounded">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              );
            } else {
              return (
                <div key={key} className="detail-item">
                  <strong>{key}:</strong> {value?.toString() || "N/A"}
                </div>
              );
            }
          })}
        </div>
      );
    } catch (error) {
      return <p>Lỗi hiển thị thông tin chi tiết</p>;
    }
  };

  // Định dạng tên loại đối tượng
  const formatEntityType = (type) => {
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

  // Định dạng tên hành động
  const formatAction = (action) => {
    switch (action) {
      case "CREATE":
        return "Tạo mới";
      case "UPDATE":
        return "Cập nhật";
      case "DELETE":
        return "Xóa";
      default:
        return action;
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết hoạt động</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered>
          <tbody>
            <tr>
              <td width="30%">
                <strong>Thời gian</strong>
              </td>
              <td>{moment(log.timestamp).format("DD/MM/YYYY HH:mm:ss")}</td>
            </tr>
            <tr>
              <td>
                <strong>Người dùng</strong>
              </td>
              <td>{log.userId?.username || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Hành động</strong>
              </td>
              <td>{formatAction(log.action)}</td>
            </tr>
            <tr>
              <td>
                <strong>Loại đối tượng</strong>
              </td>
              <td>{formatEntityType(log.entityType)}</td>
            </tr>
            <tr>
              <td>
                <strong>ID đối tượng</strong>
              </td>
              <td>{log.entityId}</td>
            </tr>
            <tr>
              <td>
                <strong>Mô tả</strong>
              </td>
              <td>{log.description}</td>
            </tr>
          </tbody>
        </Table>

        <h5 className="mt-4 mb-3">Thông tin chi tiết</h5>
        {renderDetails()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivityLogDetails;
