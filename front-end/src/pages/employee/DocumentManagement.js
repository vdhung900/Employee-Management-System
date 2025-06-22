import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Typography, Tag, Avatar, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, UserOutlined, FolderOpenOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample employee data (copy từ StaffManagement)
const employeesSample = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    employeeId: 'EMP001',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    position: 'Frontend Developer',
    department: 'Engineering',
    joinDate: '2021-05-01',
    status: 'active',
    contractType: 'Full-time',
    contractEnd: '2024-05-01',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    employeeId: 'EMP002',
    email: 'tranthib@example.com',
    phone: '0923456789',
    position: 'UI/UX Designer',
    department: 'Design',
    joinDate: '2021-06-15',
    status: 'active',
    contractType: 'Full-time',
    contractEnd: '2023-06-15',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    employeeId: 'EMP003',
    email: 'levanc@example.com',
    phone: '0934567890',
    position: 'Project Manager',
    department: 'Management',
    joinDate: '2020-10-01',
    status: 'active',
    contractType: 'Full-time',
    contractEnd: '2023-10-01',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    employeeId: 'EMP004',
    email: 'phamthid@example.com',
    phone: '0945678901',
    position: 'Accountant',
    department: 'Finance',
    joinDate: '2022-01-15',
    status: 'leave',
    contractType: 'Part-time',
    contractEnd: '2023-01-15',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    employeeId: 'EMP005',
    email: 'hoangvane@example.com',
    phone: '0956789012',
    position: 'Receptionist',
    department: 'Admin',
    joinDate: '2022-03-01',
    status: 'inactive',
    contractType: 'Contract',
    contractEnd: '2023-06-01',
  },
];

const statusColor = {
  active: 'green',
  leave: 'orange',
  inactive: 'red',
};

function getStatusLabel(status) {
  switch (status) {
    case 'active': return 'Đang làm việc';
    case 'leave': return 'Nghỉ phép';
    case 'inactive': return 'Nghỉ việc';
    default: return 'Không xác định';
  }
}

// Fake document data per employee (local state)
function getInitialDocs() {
  return {
    1: [
      { id: 101, name: 'Hợp đồng lao động.pdf', createdAt: '2023-12-01' },
      { id: 102, name: 'Bảng lương tháng 5.xlsx', createdAt: '2024-05-31' },
    ],
    2: [
      { id: 201, name: 'Giấy khen.jpg', createdAt: '2024-04-15' },
    ],
    3: [],
    4: [],
    5: [],
  };
}

const DocumentManagement = () => {
  const [selectedEmp, setSelectedEmp] = useState(employeesSample[0]);
  const [docs, setDocs] = useState(getInitialDocs());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [form] = Form.useForm();

  // Bảng nhân viên
  const empColumns = [
    {
      title: '',
      dataIndex: 'avatar',
      width: 48,
      render: (_, r) => <Avatar icon={<UserOutlined />} style={{ background: '#1976d2' }} />,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      render: (text, r) => <b>{text}</b>,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => <Tag color={statusColor[status]}>{getStatusLabel(status)}</Tag>,
    },
  ];

  // Bảng tài liệu
  const docColumns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      align: 'center',
      render: (_, __, idx) => <b>{idx + 1}</b>,
    },
    {
      title: 'Tên tài liệu',
      dataIndex: 'name',
      render: (text) => (
        <a href="#" onClick={e => { e.preventDefault(); message.info('Chức năng tải file sẽ có khi kết nối API!'); }}>
          <FileTextOutlined style={{ marginRight: 6 }} />{text}
        </a>
      ),
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'createdAt',
      render: (date) => <Tag color="blue">{date}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" type="primary" ghost>
            Sửa
          </Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteDoc(record.id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Thao tác tài liệu
  const showAddModal = () => {
    setEditingDoc(null);
    form.resetFields();
    setModalVisible(true);
  };
  const showEditModal = (doc) => {
    setEditingDoc(doc);
    form.setFieldsValue({ name: doc.name });
    setModalVisible(true);
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let newDocs = { ...docs };
      if (editingDoc) {
        // Sửa
        newDocs[selectedEmp.id] = newDocs[selectedEmp.id].map(d => d.id === editingDoc.id ? { ...d, name: values.name } : d);
        message.success('Cập nhật thành công');
      } else {
        // Thêm mới
        const newId = Date.now();
        const newDoc = { id: newId, name: values.name, createdAt: new Date().toISOString().slice(0, 10) };
        newDocs[selectedEmp.id] = [...(newDocs[selectedEmp.id] || []), newDoc];
        message.success('Thêm mới thành công');
      }
      setDocs(newDocs);
      setModalVisible(false);
      setEditingDoc(null);
    } catch (e) {
      message.error('Vui lòng nhập tên tài liệu');
    }
  };
  const handleDeleteDoc = (id) => {
    let newDocs = { ...docs };
    newDocs[selectedEmp.id] = newDocs[selectedEmp.id].filter(d => d.id !== id);
    setDocs(newDocs);
    message.success('Xóa thành công');
  };

  return (
    <div style={{ background: '#f4f8fb', minHeight: '100vh', padding: 0 }}>
      <div style={{
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <FolderOpenOutlined style={{ fontSize: 30, color: '#222' }} />
          <div>
            <Title level={2} style={{ margin: 0, color: '#222', fontWeight: 500, letterSpacing: 1, fontSize: 30 }}>Quản lý tài liệu nhân viên</Title>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Theo dõi, thêm, sửa, xóa tài liệu cho từng nhân viên trong hệ thống
            </Text>
          </div>
        </div>
      </div>
      <Row gutter={32} style={{ margin: 0, minHeight: '80vh', padding: 32 }}>
        <Col span={9}>
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Danh sách nhân viên</Title>}
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 24px #0001', minHeight: 500 }}
          >
            <Table
              columns={empColumns}
              dataSource={employeesSample}
              rowKey="id"
              pagination={false}
              rowClassName={(r) => r.id === selectedEmp.id ? 'ant-table-row-selected' : ''}
              onRow={r => ({ onClick: () => setSelectedEmp(r) })}
              style={{ cursor: 'pointer' }}
              size="middle"
            />
          </Card>
        </Col>
        <Col span={15}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar icon={<UserOutlined />} style={{ background: '#1976d2' }} />
                <div>
                  <b>{selectedEmp.name}</b> <Tag color="blue">{selectedEmp.department}</Tag>
                  <div style={{ fontSize: 13, color: '#888' }}>{selectedEmp.position}</div>
                </div>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 24px #0001', minHeight: 500 }}
            extra={<Button icon={<PlusOutlined />} type="primary" onClick={showAddModal}>Thêm tài liệu</Button>}
          >
            <Table
              columns={docColumns}
              dataSource={docs[selectedEmp.id] || []}
              rowKey="id"
              pagination={false}
              bordered
              style={{ background: '#fff', borderRadius: 8 }}
              locale={{ emptyText: 'Chưa có tài liệu nào' }}
              size="middle"
            />
          </Card>
        </Col>
        <Modal
          title={editingDoc ? 'Cập nhật tài liệu' : 'Thêm tài liệu mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleModalOk}
          okText={editingDoc ? 'Cập nhật' : 'Thêm mới'}
          cancelText="Hủy"
          destroyOnClose
        >
          <Form form={form} layout="vertical" preserve={false}>
            <Form.Item name="name" label="Tên tài liệu" rules={[{ required: true, message: 'Nhập tên tài liệu' }]}> 
              <Input placeholder="Nhập tên tài liệu (ví dụ: Hợp đồng lao động.pdf)" />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    </div>
  );
};

export default DocumentManagement; 
