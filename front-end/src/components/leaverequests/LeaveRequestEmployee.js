import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { leaveRequestService } from "../../services/leaveRequestService";

const LeaveRequestForm = ({ employeeId }) => {
    const [leaveType, setLeaveType] = useState("annual");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    console.log(employeeId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be earlier than start date.");
            return;
        }

        try {
            const res = await leaveRequestService.createLeaveRequest({
                employeeId,
                type: leaveType,
                startDate,
                endDate,
                status: "pending",
            });

            if (res.data.success) {
                setSuccess("Leave request submitted successfully!");
                setLeaveType("annual");
                setStartDate("");
                setEndDate("");
            } else {
                setError("Failed to submit leave request.");
            }
        } catch (err) {
            setError("An error occurred while submitting leave request.");
            console.error(err);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Request Leave</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                {/* Select Leave Type */}
                <Form.Group className="mb-3">
                    <Form.Label>Leave Type</Form.Label>
                    <Form.Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="annual">Annual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="unpaid">Unpaid Leave</option>
                    </Form.Select>
                </Form.Group>

                {/* Select Start Date */}
                <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>

                {/* Select End Date */}
                <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="w-100">
                    Submit Request
                </Button>
            </Form>
        </Container>
    );
};

export default LeaveRequestForm;
