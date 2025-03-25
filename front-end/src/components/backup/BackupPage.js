import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  getBackupFiles,
  createBackup,
  restoreBackup,
  deleteBackup,
} from "../../services/backupService";

const BackupPage = () => {
  const [backupFiles, setBackupFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  // Load backup files on component mount
  useEffect(() => {
    fetchBackupFiles();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  // Format file size for display
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  // Fetch backup files from the server
  const fetchBackupFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await getBackupFiles();
      setBackupFiles(files);
    } catch (err) {
      setError("Không thể tải danh sách file sao lưu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new backup
  const handleCreateBackup = async () => {
    try {
      setBackupInProgress(true);
      setError(null);
      const result = await createBackup();
      setSuccess(`Đã tạo sao lưu thành công: ${result.backupFile}`);
      fetchBackupFiles();
    } catch (err) {
      setError("Không thể tạo sao lưu: " + err.message);
    } finally {
      setBackupInProgress(false);
    }
  };

  // Handle restoring a backup
  const handleRestore = async () => {
    try {
      setRestoreInProgress(true);
      setError(null);
      await restoreBackup(selectedFile.filename);
      setSuccess("Đã khôi phục dữ liệu thành công");
      setShowRestoreModal(false);
    } catch (err) {
      setError("Không thể khôi phục dữ liệu: " + err.message);
    } finally {
      setRestoreInProgress(false);
    }
  };

  // Handle deleting a backup
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteBackup(selectedFile.filename);
      setSuccess("Đã xóa file sao lưu thành công");
      setShowDeleteModal(false);
      fetchBackupFiles();
    } catch (err) {
      setError("Không thể xóa file sao lưu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open restore confirmation modal
  const openRestoreModal = (file) => {
    setSelectedFile(file);
    setShowRestoreModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header as="h5">Sao lưu và khôi phục dữ liệu</Card.Header>
        <Card.Body>
          <Card.Text>
            Tạo bản sao lưu dữ liệu hệ thống hoặc khôi phục dữ liệu từ bản sao
            lưu đã có.
          </Card.Text>
          <Button
            variant="primary"
            onClick={handleCreateBackup}
            disabled={backupInProgress}
          >
            {backupInProgress ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang tạo sao lưu...
              </>
            ) : (
              "Tạo bản sao lưu mới"
            )}
          </Button>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <Card>
        <Card.Header as="h5">Danh sách bản sao lưu</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Tên file</th>
                  <th>Ngày tạo</th>
                  <th>Kích thước</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {backupFiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có bản sao lưu nào
                    </td>
                  </tr>
                ) : (
                  backupFiles.map((file, index) => (
                    <tr key={index}>
                      <td>{file.filename}</td>
                      <td>{formatDate(file.createdAt)}</td>
                      <td>{formatFileSize(file.size)}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => openRestoreModal(file)}
                        >
                          Khôi phục
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteModal(file)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Restore Confirmation Modal */}
      <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận khôi phục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn khôi phục dữ liệu từ file này?</p>
          <p className="fw-bold text-danger">
            Cảnh báo: Dữ liệu hiện tại sẽ bị mất và thay thế bằng dữ liệu từ bản
            sao lưu.
          </p>
          {selectedFile && (
            <div>
              <p className="mb-1">
                <strong>File:</strong> {selectedFile.filename}
              </p>
              <p className="mb-1">
                <strong>Ngày tạo:</strong> {formatDate(selectedFile.createdAt)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRestoreModal(false)}
          >
            Hủy
          </Button>
          <Button
            variant="warning"
            onClick={handleRestore}
            disabled={restoreInProgress}
          >
            {restoreInProgress ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang khôi phục...
              </>
            ) : (
              "Khôi phục"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa file sao lưu này?</p>
          {selectedFile && (
            <div>
              <p className="mb-1">
                <strong>File:</strong> {selectedFile.filename}
              </p>
              <p className="mb-1">
                <strong>Ngày tạo:</strong> {formatDate(selectedFile.createdAt)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BackupPage;
