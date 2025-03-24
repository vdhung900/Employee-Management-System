import React, { useEffect, useState } from "react";
import { notificationService } from "../../services/notificationService";
import { departmentService } from "../../services/departmentService";
import { Container, Card, Spinner, Pagination, Button, Modal, Form, Badge } from "react-bootstrap";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newNotification, setNewNotification] = useState({ title: "", content: "", targetType: "all", departmentId: "" });
    const itemsPerPage = 5;
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getAllNotifications();
            setNotifications(response.data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            alert("An error occurred while loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchDepartments();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await notificationService.deleteNotification(deleteId);
            setNotifications(notifications.filter((notif) => notif._id !== deleteId));
            setShowConfirm(false);
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert("Failed to delete notification");
        }
    };

    const handleCreateNotification = async () => {
        try {
            const target = newNotification.targetType;
            if (target === 'all') newNotification.departmentId = null;
            const response = await notificationService.createNotification({ ...newNotification, target });
            fetchNotifications();
            setShowForm(false);
            setNewNotification({ title: "", content: "", targetType: "all", departmentId: "" });
        } catch (error) {
            console.error("Error creating notification:", error);
            alert("Failed to create notification");
        }
    };

    const paginatedNotifications = notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    if (loading)
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" variant="primary" />
                <p>Loading notifications...</p>
            </div>
        );

    return (
        <Container className="mt-4">
            <h2>Notifications</h2>
            <Button variant="primary" className="mb-3" onClick={() => setShowForm(true)}>
                <FaPlus /> Create Notification
            </Button>
            {paginatedNotifications.map((notification) => (
                <Card className="mb-3" key={notification._id}>
                    <Card.Body onClick={() => toggleExpand(notification._id)} style={{ cursor: "pointer" }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <Card.Title>{notification.title}</Card.Title>
                            <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClick(notification._id); }}>
                                <FaTrash />
                            </Button>
                        </div>
                        {expandedId === notification._id && (
                            <>
                                <Card.Text>{notification.content}</Card.Text>
                                <Card.Text> {notification.target === 'all' ? 'All departments' : notification.departmentId.name}</Card.Text>
                                <Card.Footer className="text-muted">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </Card.Footer>
                            </>
                        )}
                    </Card.Body>
                </Card>
            ))}
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this notification?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newNotification.content} onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Target</Form.Label>
                            <Form.Select value={newNotification.targetType} onChange={(e) => setNewNotification({ ...newNotification, targetType: e.target.value, departmentId: "" })}>
                                <option value="all">All</option>
                                <option value="department">Department</option>
                            </Form.Select>
                        </Form.Group>
                        {newNotification.targetType === "department" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Choose Department</Form.Label>
                                <Form.Select value={newNotification.departmentId} onChange={(e) => setNewNotification({ ...newNotification, departmentId: e.target.value })}>
                                    <option value="">Select a department</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleCreateNotification}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NotificationList;
