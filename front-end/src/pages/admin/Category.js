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
  Select,
} from "antd";
import { TeamOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import APIConfig from "../../services/APIConfig";
import CategoryService from "../../services/CategoryService";
import {useLoading} from "../../contexts/LoadingContext";

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const DepartmentTab = () => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const {showLoading, hideLoading} = useLoading();
  const [form] = Form.useForm();

  const fetchManagers = async () => {
    try {
      const response = await CategoryService.getManage();
      if (response.success) {
        setManagers(response.data);
      }
      else message.error(response.message || "Lỗi khi tải danh sách quản lý");
    } catch (err) {
      message.error("Không thể tải danh sách quản lý");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await CategoryService.getDepartments();
      if (response.success) setDepartments(response.data);
      else message.error(response.message || "Lỗi khi tải phòng ban");
    } catch (err) {
      message.error("Không thể tải phòng ban");
    }
  };

  useEffect(() => {
    try{
      showLoading();
      const fetchData = async () => {
        await fetchManagers();
        await fetchDepartments();
      };
      fetchData();
    }catch (e) {
      message.error(e.message);
    }finally {
      hideLoading();
    }
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      showLoading();
      const response = await CategoryService.deleteDepartment(id);
      if (response.success) {
        message.success("Xóa phòng ban thành công");
        fetchDepartments();
      } else {
        message.error(response.message || "Xóa thất bại");
      }
    } catch (err) {
      message.error("Không thể xóa phòng ban");
    }finally {
      hideLoading();
    }
  };

  const handleOk = async () => {
    try {
      showLoading();
      const values = await form.validateFields();
      let response;
      if (editing) {
        response = await CategoryService.saveDepartment(values, editing._id);
      }else{
        response = await CategoryService.addDepartment(values);
      }
      if (response.success) {
        message.success(editing ? "Cập nhật thành công" : "Thêm thành công");
        setModalVisible(false);
        fetchDepartments();
      } else {
        message.error(response.message || "Lỗi");
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi lưu phòng ban");
    }finally {
      hideLoading()
    }
  };

  const columns = [
    { title: "Tên phòng ban", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Quản lý",
      dataIndex: ["managerId", "fullName"],
      key: "managerId",
    },
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
          <Form.Item
            name="managerId"
            label="Quản lý"
          >
            <Select
              placeholder="Chọn quản lý"
              allowClear
            >
              {managers.map((manager) => (
                <Option key={manager._id} value={manager._id}>
                  {manager.username} ({manager.employeeId?.fullName || 'N/A'})
                </Option>
              ))}
            </Select>
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
