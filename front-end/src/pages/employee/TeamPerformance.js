import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Progress,
  Select,
  Tabs,
  Space,
  Statistic,
  Button,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Form,
  Input,
  DatePicker,
  Modal,
  InputNumber,
  Radio,
  message,
} from "antd";
import {
  UserOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Line, Column } from "@ant-design/charts";
import dayjs from "dayjs";
import ThreeDCard from "../../components/3d/ThreeDCard";
import * as XLSX from "xlsx";
import GoalService from "../../services/GoalService";
import PerformanceReviewService from "../../services/PerformanceReviewService";

import { getCurrentUser } from "../../utils/auth";
import EmployeeProfile from "../../services/EmployeeProfile";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const MonthlyPerformanceReview = () => {
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [activeTab, setActiveTab] = useState("list");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [selectedEmployeeStats, setSelectedEmployeeStats] = useState(null);
  const [statsDateRange, setStatsDateRange] = useState([dayjs().startOf("month"), dayjs()]);
  const [statsViewType, setStatsViewType] = useState("current");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Lấy danh sách mục tiêu theo department
  const fetchMonthlyGoals = async () => {
    console.log("try to fetch");
    // if (!currentUser?.departmentId && !currentUser?._id) return;

    console.log("try to fetch: CHECK");

    setLoading(true);
    try {
      // Nếu có departmentId trực tiếp thì dùng, không thì lấy từ profile
      console.log("try to fetch: currentUser ", currentUser);

      let departmentId = currentUser.departmentId;

      if (!departmentId && currentUser.employeeId) {
        // Lấy thông tin employee profile để có departmentId
        console.log("try to fetch : CALL profile");

        const profileResponse = await EmployeeProfile.getEmployeeProfile(currentUser.employeeId);
        departmentId = profileResponse?.data?.departmentId?._id;
      }

      if (departmentId) {
        console.log("try to fetch : CALL");

        const response = await GoalService.getMonthlyGoalsByDepartment(departmentId);
        console.log("Monthly goals response:", response);
        setMonthlyGoals(response || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mục tiêu:", error);
      message.error("Không thể lấy danh sách mục tiêu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMonthlyGoals();
    }
  }, [currentUser]);

  // Lọc dữ liệu theo trạng thái
  const getFilteredGoals = () => {
    let filtered = monthlyGoals;

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        filtered = filtered.filter((goal) => !goal.isReviewed);
      } else if (statusFilter === "completed") {
        filtered = filtered.filter((goal) => goal.isReviewed);
      }
    }

    // Lọc theo tháng nếu cần
    const selectedMonthValue = selectedMonth.month() + 1;
    const selectedYearValue = selectedMonth.year();
    filtered = filtered.filter(
      (goal) => goal.month === selectedMonthValue && goal.year === selectedYearValue
    );

    return filtered;
  };

  const handleEvaluate = (goalData) => {
    console.log("Goal data for evaluation:", goalData);
    setSelectedGoal(goalData);

    // Thiết lập form với dữ liệu từ goal
    const formData = {
      month: dayjs(`${goalData.year}-${goalData.month}`, "YYYY-M"),
      results: goalData.goals.map((goal) => ({
        goalTitle: goal.title,
        targetValue: goal.targetValue,
        actualValue: 0,
        score: 0,
        code: goal.code, // Sử dụng code thay vì singleGoalId
      })),
      overallScore: 0,
      comment: "",
    };

    console.log("Form data to set:", formData);
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  };

  const handleSubmitEvaluation = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị dữ liệu để gửi API
      const reviewData = {
        goal_ref: selectedGoal._id,
        results: values.results.map((result) => ({
          code: result.code,
          actualValue: result.actualValue,
          score: result.score,
        })),
        overallScore: values.overallScore,
        comment: values.comment,
      };

      console.log("Sending review data:", reviewData);
      await PerformanceReviewService.submitPerformanceReview(reviewData);
      message.success("Đánh giá hiệu suất đã được gửi thành công!");
      setIsModalVisible(false);

      // Refresh data
      fetchMonthlyGoals();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      message.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const handleShowStats = (goalData) => {
    setSelectedEmployeeStats(goalData);
    setIsStatsModalVisible(true);
  };

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Đánh giá");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleExportStats = () => {
    const exportData = getFilteredGoals().map((goal) => ({
      "Nhân viên": goal.employee?.fullName || "N/A",
      Email: goal.employee?.email || "N/A",
      Tháng: `${goal.month}/${goal.year}`,
      "Trạng thái": goal.isReviewed ? "Đã đánh giá" : "Chờ đánh giá",
      "Số mục tiêu": goal.goals?.length || 0,
      "Ngày tạo": dayjs(goal.createdAt).format("DD/MM/YYYY"),
      ...goal.goals?.reduce(
        (acc, goalItem, index) => ({
          ...acc,
          [`Mục tiêu ${index + 1}`]: goalItem.title,
          [`Chỉ tiêu ${index + 1}`]: goalItem.targetValue,
        }),
        {}
      ),
    }));

    exportToExcel(exportData, `Thống kê mục tiêu - ${dayjs().format("YYYY-MM")}`);
  };

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{text || "N/A"}</Text>
            <div>
              <Text type="secondary">{record.employee?.email || "N/A"}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Tháng/Năm",
      key: "monthYear",
      render: (_, record) => `${record.month}/${record.year}`,
    },
    {
      title: "Số mục tiêu",
      key: "goalsCount",
      render: (_, record) => record.goals?.length || 0,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isReviewed ? "success" : "processing"}>
          {record.isReviewed ? "Đã đánh giá" : "Chờ đánh giá"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          {!record.isReviewed && (
            <Button
              type="primary"
              icon={<FileSearchOutlined />}
              onClick={() => handleEvaluate(record)}
            >
              Đánh giá
            </Button>
          )}
          <Button
            type="default"
            icon={<LineChartOutlined />}
            onClick={() => handleShowStats(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const getPerformanceData = (goalData) => {
    if (!goalData?.goals) return [];
    return goalData.goals.map((goal, index) => ({
      goal: goal.title,
      target: goal.targetValue,
      index: index + 1,
    }));
  };

  const getOverallStats = () => {
    const filteredGoals = getFilteredGoals();
    const totalGoals = filteredGoals.reduce((sum, goal) => sum + (goal.goals?.length || 0), 0);
    const reviewedGoals = filteredGoals.filter((goal) => goal.isReviewed).length;

    return {
      totalEmployees: filteredGoals.length,
      totalGoals: totalGoals,
      reviewedCount: reviewedGoals,
      pendingCount: filteredGoals.length - reviewedGoals,
    };
  };

  const items = [
    {
      key: "list",
      label: "Danh sách đánh giá",
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Space size="large">
                <DatePicker.MonthPicker
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  format="MM/YYYY"
                  placeholder="Chọn tháng đánh giá"
                />
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200 }}>
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="pending">Chờ đánh giá</Option>
                  <Option value="completed">Đã đánh giá</Option>
                </Select>
                <Button type="default" icon={<DownloadOutlined />} onClick={handleExportStats}>
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={getFilteredGoals()}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục tiêu`,
            }}
          />
        </div>
      ),
    },
    {
      key: "statistics",
      label: "Thống kê đánh giá",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space size="large" style={{ marginBottom: 16 }}>
                <DatePicker.MonthPicker
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  format="MM/YYYY"
                  placeholder="Chọn tháng thống kê"
                />
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200 }}>
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="pending">Chờ đánh giá</Option>
                  <Option value="completed">Đã đánh giá</Option>
                </Select>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <ThreeDCard>
                <Statistic
                  title="Tổng nhân viên"
                  value={getOverallStats().totalEmployees}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </ThreeDCard>
            </Col>
            <Col xs={24} md={6}>
              <ThreeDCard>
                <Statistic
                  title="Đã đánh giá"
                  value={getOverallStats().reviewedCount}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </ThreeDCard>
            </Col>
            <Col xs={24} md={6}>
              <ThreeDCard>
                <Statistic
                  title="Chờ đánh giá"
                  value={getOverallStats().pendingCount}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </ThreeDCard>
            </Col>
            <Col xs={24} md={6}>
              <ThreeDCard>
                <Statistic
                  title="Tổng mục tiêu"
                  value={getOverallStats().totalGoals}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </ThreeDCard>
            </Col>
          </Row>

          <Card title="Phân bố trạng thái đánh giá" style={{ marginTop: 16 }}>
            <Column
              data={[
                {
                  status: "Đã đánh giá",
                  count: getOverallStats().reviewedCount,
                },
                {
                  status: "Chờ đánh giá",
                  count: getOverallStats().pendingCount,
                },
              ]}
              xField="status"
              yField="count"
              label={{
                position: "top",
              }}
              color={({ status }) => (status === "Đã đánh giá" ? "#52c41a" : "#faad14")}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <BarChartOutlined style={{ marginRight: 8 }} /> Đánh giá hiệu suất nhân
        viên
      </Title>
      <Divider />

      <Card>
        <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />
      </Card>

      <Modal
        title="Đánh giá hiệu suất nhân viên"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitEvaluation}
        width={800}
        confirmLoading={loading}
      >
        {selectedGoal && (
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    style={{ marginRight: 16 }}
                  />
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedGoal.employee?.fullName || "N/A"}
                    </Text>
                    <div>
                      <Text type="secondary">
                        {selectedGoal.employee?.email || "N/A"}
                      </Text>
                    </div>
                  </div>
                </div>
                <Divider />
              </Col>

              <Col span={12}>
                <Form.Item
                  name="month"
                  label="Tháng đánh giá"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tháng đánh giá",
                    },
                  ]}
                >
                  <DatePicker.MonthPicker
                    format="MM/YYYY"
                    style={{ width: "100%" }}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider orientation="left">Đánh giá các mục tiêu</Divider>
                <Form.List name="results">
                  {(fields) => (
                    <>
                      {fields.map(({ key, name }) => (
                        <Row key={key} gutter={[16, 16]}>
                          <Col span={2}>
                            <Form.Item name={[name, "code"]} label="Code">
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={[name, "goalTitle"]}
                              label="Mục tiêu"
                            >
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              name={[name, "targetValue"]}
                              label="Chỉ tiêu"
                            >
                              <InputNumber disabled style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              name={[name, "actualValue"]}
                              label="Thực tế"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập giá trị thực tế",
                                },
                                {
                                  type: "number",
                                  min: 0,
                                  max: 100,
                                  message: "Giá trị thực tế phải từ 0 đến 100",
                                },
                              ]}
                            >
                              <InputNumber
                                min={0}
                                max={100}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={[name, "score"]}
                              label="Điểm"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập điểm đánh giá",
                                },
                                {
                                  type: "number",
                                  min: 0,
                                  max: 10,
                                  message: "Điểm đánh giá phải từ 0 đến 10",
                                },
                              ]}
                            >
                              <InputNumber
                                min={0}
                                max={10}
                                step={0.1}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="overallScore"
                  label="Điểm tổng thể"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập điểm tổng thể",
                    },
                    {
                      type: "number",
                      min: 0,
                      max: 10,
                      message: "Điểm tổng thể phải từ 0 đến 10",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.1}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="comment"
                  label="Nhận xét đánh giá"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nhận xét đánh giá",
                    },
                    {
                      max: 500,
                      message: "Nhận xét không được dài hơn 500 ký tự",
                    },
                    {
                      whitespace: true,
                      message: "Nhận xét không được để trống",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập nhận xét chi tiết về hiệu suất làm việc của nhân viên"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      <Modal
        title={`Chi tiết mục tiêu - ${
          selectedEmployeeStats?.employee?.fullName || "N/A"
        }`}
        open={isStatsModalVisible}
        onCancel={() => setIsStatsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsStatsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedEmployeeStats && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <ThreeDCard>
                  <Statistic
                    title="Tháng/Năm"
                    value={`${selectedEmployeeStats.month}/${selectedEmployeeStats.year}`}
                  />
                </ThreeDCard>
              </Col>
              <Col span={8}>
                <ThreeDCard>
                  <Statistic
                    title="Số mục tiêu"
                    value={selectedEmployeeStats.goals?.length || 0}
                  />
                </ThreeDCard>
              </Col>
              <Col span={8}>
                <ThreeDCard>
                  <Statistic
                    title="Trạng thái"
                    value={
                      selectedEmployeeStats.isReviewed
                        ? "Đã đánh giá"
                        : "Chờ đánh giá"
                    }
                    valueStyle={{
                      color: selectedEmployeeStats.isReviewed
                        ? "#52c41a"
                        : "#faad14",
                    }}
                  />
                </ThreeDCard>
              </Col>
            </Row>

            <Card title="Danh sách mục tiêu" style={{ marginTop: 16 }}>
              <Table
                dataSource={selectedEmployeeStats.goals || []}
                columns={[
                  {
                    title: "Code",
                    dataIndex: "code",
                    key: "code",
                  },
                  {
                    title: "Tên mục tiêu",
                    dataIndex: "title",
                    key: "title",
                  },
                  {
                    title: "Chỉ tiêu",
                    dataIndex: "targetValue",
                    key: "targetValue",
                  },
                ]}
                pagination={false}
                rowKey={(record, index) => index}
              />
            </Card>

            <Card title="Thông tin nhân viên" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Họ tên: </Text>
                  <Text>
                    {selectedEmployeeStats.employee?.fullName || "N/A"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Email: </Text>
                  <Text>{selectedEmployeeStats.employee?.email || "N/A"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số điện thoại: </Text>
                  <Text>{selectedEmployeeStats.employee?.phone || "N/A"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày tạo: </Text>
                  <Text>
                    {dayjs(selectedEmployeeStats.createdAt).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </Text>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonthlyPerformanceReview;
