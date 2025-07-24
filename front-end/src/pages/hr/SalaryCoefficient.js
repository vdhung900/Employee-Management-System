import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, message, Typography, Space, Tag } from 'antd';
import SalaryCoefficientService from '../../services/SalaryCoefficientService';
import { EditOutlined, EyeOutlined, PlusOutlined, CalculatorOutlined } from '@ant-design/icons';

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
      
      // Validate hệ số lương
      if (values.salary_coefficient < 2 || values.salary_coefficient > 8) {
        message.error('Hệ số lương phải nằm trong khoảng từ 2.0 đến 8.0');
        return;
      }

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
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Title level={3}>
        <CalculatorOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        Quản lý hệ số lương
      </Title>
      <Space style={{ marginBottom: 16 }}>
        <input
          placeholder="Tìm kiếm theo bậc lương hoặc hệ số"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', width: 'auto', minWidth: 250, height: 36, flex: 1, marginRight: 16 }}
        />
        <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
          Thêm hệ số lương
        </Button>
      </Space>
      <div style={{ padding: '12px 0' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={pag => setPagination(pag)}
        />
      </div>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>
              {editData ? 'Cập nhật hệ số lương' : 'Thêm hệ số lương mới'}
            </span>
          </div>
        }
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
        centered
        okButtonProps={{
          style: {
            borderRadius: 6,
            height: 36,
            fontWeight: 500
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 6,
            height: 36,
            fontWeight: 500
          }
        }}
        bodyStyle={{
          padding: '20px 0'
        }}
      >
        <Form form={form} layout="vertical" style={{ padding: '0 24px' }}>
          <Form.Item
            name="salary_rankId"
            label={
              <span style={{ fontWeight: 500, color: '#262626', fontSize: 14 }}>
                Bậc lương
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn bậc lương' }]}
          >
            <Select 
              placeholder="Chọn bậc lương"
              style={{ height: 36, borderRadius: 6 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {salaryRanks.map((rank) => (
                <Option key={rank._id} value={rank._id}>
                  {rank.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="salary_coefficient"
            label={
              <span style={{ fontWeight: 500, color: '#262626', fontSize: 14 }}>
                Hệ số lương
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập hệ số lương' },
              { type: 'number', min: 2, message: 'Hệ số lương không được nhỏ hơn 2.0' },
              { type: 'number', max: 8, message: 'Hệ số lương không được lớn hơn 8.0' }
            ]}
          >
            <InputNumber 
              min={2} 
              max={8}
              step={0.1} 
              style={{ width: '100%', height: 36, borderRadius: 6 }} 
              placeholder="Nhập hệ số lương (2.0 - 8.0)"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>
              Chi tiết hệ số lương
            </span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={500}
        centered
        bodyStyle={{
          padding: '24px'
        }}
      >
        {detailData && (
          <div>
            <div style={{ 
              background: '#fafafa', 
              padding: '10px', 
              borderRadius: 6, 
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>Bậc lương:</span>
                <span style={{ fontWeight: 500, fontSize: 14, color: '#595959' }}>
                  {detailData.salary_rankId?.name || detailData.salary_rankId}
                </span>
              </div>
            </div>
            
            <div style={{ 
              background: '#fafafa', 
              padding: '10px', 
              borderRadius: 6, 
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>Hệ số lương:</span>
                <Tag 
                  color="blue" 
                  style={{ 
                    fontSize: 13, 
                    fontWeight: 500, 
                    padding: '2px 8px',
                    borderRadius: 4
                  }}
                >
                  {detailData.salary_coefficient}
                </Tag>
              </div>
            </div>
            
            <div style={{ 
              background: '#fafafa', 
              padding: '10px', 
              borderRadius: 6,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>Lương cơ bản:</span>
                <Tag 
                  color="green" 
                  style={{ 
                    fontSize: 13, 
                    fontWeight: 500, 
                    padding: '2px 8px',
                    borderRadius: 4
                  }}
                >
                  {detailData.salary_rankId?.salary_base ? 
                    `${detailData.salary_rankId.salary_base.toLocaleString('vi-VN')} VNĐ` : 
                    'Không có dữ liệu'
                  }
                </Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalaryCoefficient; 