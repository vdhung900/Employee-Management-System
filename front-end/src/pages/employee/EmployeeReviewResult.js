import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Avatar,
  Divider,
  Empty,
  Tooltip,
  Button,
  Modal,
  Spin,
  message,
  Statistic,
  Progress,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  EyeOutlined,
  TrophyOutlined,
  StarOutlined,
  BulbOutlined,
  CommentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ThreeDCard from "../../components/3d/ThreeDCard";
import { getCurrentUser } from "../../utils/auth";
import PerformanceReviewService from "../../services/PerformanceReviewService";

const { Title, Text, Paragraph } = Typography;

const EmployeeReviewResult = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user && user.employeeId) {
      fetchReviews(user.employeeId);
    }
  }, []);

  const fetchReviews = async (employeeId) => {
    setLoading(true);
    try {
      const response = await PerformanceReviewService.getReviewsByEmployeeId(
        employeeId
      );
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đánh giá:", error);
      message.error("Không thể tải dữ liệu đánh giá hiệu suất");
    } finally {
      setLoading(false);
    }
  };

  const showReviewDetails = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "#52c41a";
    if (score >= 7) return "#1890ff";
    if (score >= 5) return "#faad14";
    return "#ff4d4f";
  };

  const getScoreStatus = (score) => {
    if (score >= 9) return "Xuất sắc";
    if (score >= 7) return "Tốt";
    if (score >= 5) return "Trung bình";
    return "Cần cải thiện";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const resultColumns = [
    {
      title: "Mã mục tiêu",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Tên mục tiêu",
      dataIndex: "goalTitle",
      key: "goalTitle",
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: "Mục tiêu",
      dataIndex: "targetValue",
      key: "targetValue",
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "Thực hiện",
      dataIndex: "actualValue",
      key: "actualValue",
      render: (value, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ color: getScoreColor(record.score) }}>
            {value}
          </Text>
          <Progress
            percent={Math.min((value / record.targetValue) * 100, 100)}
            size="small"
            strokeColor={getScoreColor(record.score)}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Space direction="vertical" size="small" align="center">
          <Tag
            color={
              score >= 9
                ? "success"
                : score >= 7
                ? "processing"
                : score >= 5
                ? "warning"
                : "error"
            }
          >
            <StarOutlined /> {score}
          </Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {getScoreStatus(score)}
          </Text>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu đánh giá..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)",
      }}
    >
      <Title level={2} style={{ marginBottom: 24 }}>
        <TrophyOutlined style={{ color: "#1890ff", marginRight: 12 }} />
        Kết quả đánh giá hiệu suất của tôi
      </Title>

      {reviews.length > 0 ? (
        <Row gutter={[24, 24]}>
          {reviews.map((review, index) => (
            <Col xs={24} lg={12} key={review._id}>
              <ThreeDCard
                title={
                  <Space>
                    <CalendarOutlined style={{ color: "#1890ff" }} />
                    <Text strong>
                      Tháng {review.month}/{review.year}
                    </Text>
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => showReviewDetails(review)}
                  >
                    Chi tiết
                  </Button>
                }
                style={{ marginBottom: 16 }}
                hoverable
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {/* Thông tin người đánh giá */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ background: "#52c41a" }}
                    />
                    <div>
                      <Text strong>Người đánh giá: </Text>
                      <Text>{review.reviewer?.fullName || "N/A"}</Text>
                      <br />
                      <Text type="secondary">
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {formatDate(review.created_at)}
                      </Text>
                    </div>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  {/* Điểm tổng quan */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Điểm tổng quan"
                        value={review.overallScore}
                        suffix="/10"
                        valueStyle={{
                          color: getScoreColor(review.overallScore),
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Số mục tiêu"
                        value={review.results?.length || 0}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Col>
                  </Row>

                  {/* Nhận xét */}
                  {review.comment && (
                    <>
                      <Divider style={{ margin: "12px 0" }} />
                      <div>
                        <Text strong>
                          <CommentOutlined
                            style={{ marginRight: 8, color: "#722ed1" }}
                          />
                          Nhận xét:
                        </Text>
                        <Paragraph
                          style={{
                            marginTop: 8,
                            background: "#f6ffed",
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #b7eb8f",
                          }}
                        >
                          {review.comment}
                        </Paragraph>
                      </div>
                    </>
                  )}
                </Space>
              </ThreeDCard>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="Chưa có kết quả đánh giá nào"
          style={{ marginTop: 80 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* Modal chi tiết */}
      <Modal
        title={
          <Space>
            <BulbOutlined style={{ color: "#1890ff" }} />
            <Text strong>
              Chi tiết đánh giá - Tháng {selectedReview?.month}/
              {selectedReview?.year}
            </Text>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedReview && (
          <div>
            {/* Thông tin tổng quan */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Điểm tổng quan"
                    value={selectedReview.overallScore}
                    suffix="/10"
                    valueStyle={{
                      color: getScoreColor(selectedReview.overallScore),
                      fontWeight: "bold",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <div>
                    <Text type="secondary">Người đánh giá</Text>
                    <br />
                    <Text strong>{selectedReview.reviewer?.fullName}</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text type="secondary">Ngày đánh giá</Text>
                    <br />
                    <Text strong>{formatDate(selectedReview.created_at)}</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Bảng chi tiết kết quả */}
            <Title level={4}>
              <StarOutlined style={{ color: "#faad14", marginRight: 8 }} />
              Chi tiết mục tiêu và kết quả
            </Title>
            <Table
              dataSource={selectedReview.results}
              columns={resultColumns}
              rowKey="_id"
              pagination={false}
              size="small"
              style={{ marginBottom: 16 }}
            />

            {/* Nhận xét */}
            {selectedReview.comment && (
              <div>
                <Title level={4}>
                  <CommentOutlined
                    style={{ color: "#722ed1", marginRight: 8 }}
                  />
                  Nhận xét từ người đánh giá
                </Title>
                <Card size="small">
                  <Paragraph>{selectedReview.comment}</Paragraph>
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeReviewResult;
