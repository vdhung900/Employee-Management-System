import React, { useState } from 'react';
import { Card, Typography, Row, Col, Table, Tag, Space, Avatar, Divider, Empty, Tooltip } from 'antd';
import { UserOutlined, StarFilled, CalendarOutlined, TeamOutlined, SmileOutlined, BulbOutlined, LikeOutlined } from '@ant-design/icons';
import ThreeDCard from '../../components/3d/ThreeDCard';

const { Title, Text, Paragraph } = Typography;

// Mock data đánh giá
const reviewData = [
  {
    period: 'Tháng 06/2024',
    reviewer: 'Nguyễn Văn A (Trưởng phòng)',
    date: '2024-06-28',
    scores: {
      skill: 8,
      attitude: 9,
      teamwork: 8,
      creativity: 7,
      discipline: 9
    },
    comment: 'Nhân viên có năng lực tốt, thái độ tích cực, phối hợp nhóm hiệu quả. Cần chủ động sáng tạo hơn trong công việc.',
  },
  {
    period: 'Tháng 05/2024',
    reviewer: 'Nguyễn Văn A (Trưởng phòng)',
    date: '2024-05-29',
    scores: {
      skill: 7,
      attitude: 8,
      teamwork: 8,
      creativity: 6,
      discipline: 8
    },
    comment: 'Hoàn thành tốt nhiệm vụ, tuân thủ kỷ luật, cần cải thiện kỹ năng chuyên môn.',
  },
];

const scoreColor = (score) => {
  if (score >= 9) return 'green';
  if (score >= 7) return 'blue';
  if (score >= 5) return 'orange';
  return 'red';
};

const criteria = [
  { key: 'skill', label: 'Năng lực', icon: <StarFilled style={{ color: '#faad14' }} /> },
  { key: 'attitude', label: 'Thái độ', icon: <SmileOutlined style={{ color: '#52c41a' }} /> },
  { key: 'teamwork', label: 'Teamwork', icon: <TeamOutlined style={{ color: '#1890ff' }} /> },
  { key: 'creativity', label: 'Sáng tạo', icon: <BulbOutlined style={{ color: '#722ed1' }} /> },
  { key: 'discipline', label: 'Kỷ luật', icon: <LikeOutlined style={{ color: '#ff4d4f' }} /> },
];

const EmployeeReviewResult = () => {
  // Nếu chưa có đánh giá, set reviewData = []
  const hasReview = reviewData.length > 0;

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 60%, #e3f2fd 100%)' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <CalendarOutlined style={{ color: '#1890ff', marginRight: 12 }} />Kết quả đánh giá từ cấp trên
      </Title>
      {hasReview ? (
        <Row gutter={[24, 24]}>
          {reviewData.map((review, idx) => (
            <Col xs={24} md={12} key={idx}>
              <ThreeDCard
                title={
                  <span>
                    <Tag color="blue" style={{ fontSize: 15, padding: '4px 16px', borderRadius: 16 }}>{review.period}</Tag>
                  </span>
                }
                style={{ marginBottom: 16, borderRadius: 18 }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <Avatar icon={<UserOutlined />} style={{ background: '#1890ff', marginRight: 12 }} />
                  <div>
                    <Text strong>Người đánh giá: </Text>
                    <Text>{review.reviewer}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Ngày đánh giá: {review.date}</Text>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }}>Điểm đánh giá</Divider>
                <Row gutter={[8, 8]}>
                  {criteria.map(c => (
                    <Col xs={12} sm={8} key={c.key}>
                      <Tooltip title={c.label}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {c.icon}
                          <span style={{ fontWeight: 500 }}>{c.label}:</span>
                          <Tag color={scoreColor(review.scores[c.key])} style={{ fontSize: 15, minWidth: 32, textAlign: 'center', borderRadius: 8 }}>
                            {review.scores[c.key]}
                          </Tag>
                        </div>
                      </Tooltip>
                    </Col>
                  ))}
                </Row>
                <Divider style={{ margin: '16px 0 8px 0' }}>Nhận xét tổng quan</Divider>
                <Paragraph style={{ background: '#fff', borderRadius: 8, padding: 16, fontSize: 15, minHeight: 60 }}>{review.comment}</Paragraph>
              </ThreeDCard>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Chưa có kết quả đánh giá nào từ cấp trên" style={{ marginTop: 80 }} />
      )}
    </div>
  );
};

export default EmployeeReviewResult; 
