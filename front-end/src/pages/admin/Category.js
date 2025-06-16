import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Tabs,
} from "antd";
import { TeamOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import APIConfig from "../../services/APIConfig";

const { Title } = Typography;
const { TabPane } = Tabs;

const DepartmentTab = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${APIConfig.baseUrl}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDepartments(data.data);
      else message.error(data.message || "Lỗi khi tải phòng ban");
    } catch (err) {
      message.error("Không thể tải phòng ban");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${APIConfig.baseUrl}/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        message.success("Xóa phòng ban thành công");
        fetchDepartments();
      } else {
        message.error(data.message || "Xóa thất bại");
      }
    } catch (err) {
      message.error("Không thể xóa phòng ban");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("accessToken");
      let url = `${APIConfig.baseUrl}/departments`;
      let method = "POST";
      if (editing) {
        url = `${APIConfig.baseUrl}/departments/${editing._id}`;
        method = "PATCH";
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success(editing ? "Cập nhật thành công" : "Thêm thành công");
        setModalVisible(false);
        fetchDepartments();
      } else {
        message.error(data.message || "Lỗi");
      }
    } catch (err) {
      // validation error
    }
  };

  const columns = [
    { title: "Tên phòng ban", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm phòng ban
      </Button>
      <Table
        dataSource={departments}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editing ? "Cập nhật phòng ban" : "Thêm phòng ban"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phòng ban"
            rules={[{ required: true, message: "Nhập tên phòng ban" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const Category = () => {
  const [activeTab, setActiveTab] = useState("department");
  return (
    <div>
      <Title level={3}>
        <TeamOutlined style={{ marginRight: 8 }} />
        Danh mục
      </Title>
      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <TeamOutlined /> Phòng ban
              </span>
            }
            key="department"
          >
            <DepartmentTab />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Category;
