import React from "react";
import { Card, Row, Col, Progress, Typography, Tag, Space, Avatar } from "antd";
import {
  CoffeeOutlined,
  HeartTwoTone,
  SmileTwoTone,
  WomanOutlined,
  ManOutlined,
  GiftOutlined,
  HomeOutlined,
  CloudOutlined,
  UserOutlined, FieldTimeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Mock data các loại ngày nghỉ
const leaveTypes = [
  {
    key: "annual",
    name: "Nghỉ phép năm",
    icon: <CoffeeOutlined style={{ color: "#faad14" }} />,
    color: "#faad14",
    total: 12,
    used: 5,
    remaining: 7,
    tag: <Tag color="gold">Phép năm</Tag>,
  },
  {
    key: "sick",
    name: "Nghỉ ốm",
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    color: "#eb2f96",
    total: 6,
    used: 2,
    remaining: 4,
    tag: <Tag color="magenta">Ốm</Tag>,
  },
  {
    key: "maternity",
    name: "Nghỉ thai sản",
    icon: <WomanOutlined style={{ color: "#d46b08" }} />,
    color: "#d46b08",
    total: 180,
    used: 60,
    remaining: 120,
    tag: <Tag color="volcano">Thai sản</Tag>,
  },
  {
    key: "paternity",
    name: "Nghỉ vợ sinh con",
    icon: <ManOutlined style={{ color: "#1890ff" }} />,
    color: "#1890ff",
    total: 5,
    used: 1,
    remaining: 4,
    tag: <Tag color="blue">Vợ sinh</Tag>,
  },
  {
    key: "marriage",
    name: "Nghỉ cưới",
    icon: <GiftOutlined style={{ color: "#722ed1" }} />,
    color: "#722ed1",
    total: 3,
    used: 0,
    remaining: 3,
    tag: <Tag color="purple">Cưới</Tag>,
  },
  {
    key: "funeral",
    name: "Nghỉ tang",
    icon: <HomeOutlined style={{ color: "#595959" }} />,
    color: "#595959",
    total: 3,
    used: 0,
    remaining: 3,
    tag: <Tag color="gray">Tang</Tag>,
  },
  {
    key: "unpaid",
    name: "Nghỉ không lương",
    icon: <CloudOutlined style={{ color: "#bfbfbf" }} />,
    color: "#bfbfbf",
    total: 30,
    used: 0,
    remaining: 30,
    tag: <Tag color="default">Không lương</Tag>,
  },
];

const LeaveBalance = () => {
  return (
    <div style={{ background: "white", minHeight: "80vh", padding: 24 }}>
      <Row justify="center" style={{ marginBottom: 32 }}>
        <Col>
          <Space align="center" size={16}>
            <Avatar size={48} icon={<FieldTimeOutlined />} style={{ background: "#1976d2" }} />
            <div>
              <Title level={2} style={{ margin: 0, color: "#222", fontWeight: 600, letterSpacing: 1 }}>
                Quỹ ngày nghỉ còn lại
              </Title>
              <Text style={{ fontSize: 16, color: "#666" }}>
                Theo dõi số ngày nghỉ còn lại của bạn trong năm
              </Text>
            </div>
          </Space>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="center">
        {leaveTypes.map((type) => (
          <Col xs={24} sm={12} md={8} lg={6} key={type.key}>
            <Card
              hoverable
              style={{ borderRadius: 16, boxShadow: "0 4px 24px #0001", minHeight: 220 }}
              bodyStyle={{ padding: 24 }}
            >
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space align="center" size={12}>
                  <span style={{ fontSize: 32 }}>{type.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{type.name}</span>
                  {type.tag}
                </Space>
                <Progress
                  percent={Math.round((type.used / type.total) * 100)}
                  status="active"
                  strokeColor={type.color}
                  showInfo={false}
                  style={{ margin: "8px 0" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ color: type.color }}>
                    Đã dùng: {type.used} / {type.total} ngày
                  </Text>
                  <Text type="success" style={{ fontWeight: 500 }}>
                    Còn lại: {type.remaining} ngày
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LeaveBalance; 