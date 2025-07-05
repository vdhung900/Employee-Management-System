import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, message, Typography, Space, Tag } from 'antd';
import SalaryCoefficientService from '../../services/SalaryCoefficientService';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const SalaryCoefficient = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [salaryRanks, setSalaryRanks] = useState([]);
  const [form] = Form.useForm();
  const [detailData, setDetailData] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await SalaryCoefficientService.getAll();
      setData(res);
    } catch (err) {
      message.error('Lỗi khi tải danh sách hệ số lương');
    }
    setLoading(false);
  };

  const fetchSalaryRanks = async () => {
    try {
      const res = await SalaryCoefficientService.getSalaryRanks();
      setSalaryRanks(res);
    } catch (err) {
      setSalaryRanks([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSalaryRanks();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditData(record);
    form.setFieldsValue({
      salary_rankId: record.salary_rankId?._id || record.salary_rankId,
      salary_coefficient: record.salary_coefficient,
    });
    setModalVisible(true);
  };

  const handleDetail = async (record) => {
    try {
      const detail = await SalaryCoefficientService.getById(record._id);
      setDetailData(detail);
      setDetailModalVisible(true);
    } catch {
      message.error('Không thể lấy chi tiết!');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editData) {
        await SalaryCoefficientService.update(editData._id, values);
        message.success('Cập nhật thành công');
      } else {
        await SalaryCoefficientService.create(values);
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  const filteredData = data.filter(item => {
    if (!search) return true;
    return (
      (item.salary_rankId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(item.salary_coefficient).includes(search)
    );
  });

  const columns = [
    {
      title: 'Bậc lương',
      dataIndex: 'salary_rankId',
      key: 'salary_rankId',
      render: (val) => val?.name || val,
    },
    {
      title: 'Hệ số lương',
      dataIndex: 'salary_coefficient',
      key: 'salary_coefficient',
      sorter: (a, b) => a.salary_coefficient - b.salary_coefficient,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" type="primary" ghost>
            Sửa
          </Button>
          <Button icon={<EyeOutlined />} onClick={() => handleDetail(record)} size="small" type="primary" style={{ borderColor: '#52c41a', color: '#52c41a' }} ghost>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="welcome-section glass-effect" style={{
      padding: '24px',
      marginBottom: '24px',
      borderRadius: '16px',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(57, 120, 26, 0.2)'
    }}>
      <Title level={3}>Quản lý hệ số lương</Title>
      <Space style={{ marginBottom: 16 }}>
        <input
          placeholder="Tìm kiếm theo bậc lương hoặc hệ số"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', width: 'auto', minWidth: 250, height: 36, flex: 1, marginRight: 16 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Thêm hệ số lương
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={pag => setPagination(pag)}
      />
      <Modal
        title={editData ? 'Cập nhật hệ số lương' : 'Thêm hệ số lương'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="salary_rankId"
            label="Bậc lương"
            rules={[{ required: true, message: 'Vui lòng chọn bậc lương' }]}
          >
            <Select placeholder="Chọn bậc lương">
              {salaryRanks.map((rank) => (
                <Option key={rank._id} value={rank._id}>
                  {rank.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="salary_coefficient"
            label="Hệ số lương"
            rules={[{ required: true, message: 'Vui lòng nhập hệ số lương' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết hệ số lương"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {detailData && (
          <div>
            <p><b>Bậc lương:</b> {detailData.salary_rankId?.name || detailData.salary_rankId}</p>
            <p><b>Hệ số lương:</b> <Tag color="blue">{detailData.salary_coefficient}</Tag></p>
            <p><b>Lương cơ bản:</b> <Tag color="green">{detailData.salary_rankId?.salary_base ?? 'Không có dữ liệu'}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalaryCoefficient; 