import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { leaveRequestService } from "../../services/leaveRequestService";

const LeaveRequestAdmin = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);

    const fetchLeaveRequests = async () => {
        try {
            const res = await leaveRequestService.getAllLeaveRequests();
            setLeaveRequests(res.data.data);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };

    const updateLeaveStatus = async (id, status) => {
        try {
            await leaveRequestService.updateLeaveRequest(id, { status });
            fetchLeaveRequests();
        } catch (error) {
            console.error("Error updating leave request:", error);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    return (
        <Container>
            <h2 className="text-center my-4">Leave Requests Management</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Remaining Days</th> {/* Cột mới */}
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.map((request) => (
                        <tr key={request._id}>
                            <td>{request.employeeId.fullName}</td>
                            <td>{request.employeeId.departmentId?.name || "Unknown"}</td>
                            <td>{request.employeeId.position}</td>
                            <td>{request.type}</td>
                            <td>{new Date(request.startDate).toLocaleDateString()}</td>
                            <td>{new Date(request.endDate).toLocaleDateString()}</td>
                            <td>{request.remainingDays}</td> {/* Hiển thị số ngày phép còn lại */}
                            <td>
                                <Badge
                                    bg={
                                        request.status === "approved"
                                            ? "success"
                                            : request.status === "rejected"
                                                ? "danger"
                                                : "warning"
                                    }
                                >
                                    {request.status}
                                </Badge>
                            </td>
                            <td>
                                {request.status === "pending" && (
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => updateLeaveStatus(request._id, "approved")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => updateLeaveStatus(request._id, "rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default LeaveRequestAdmin;
