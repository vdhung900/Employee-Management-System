import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Typography, Tag, Avatar, Row, Col } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  FolderOpenOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Hr_Employee from "../../services/Hr_Employee";
import {STATUS} from "../../constants/Status";
import UploadFileComponent from "../../components/file-list/FileList";
import DocumentService from "../../services/DocumentService";
import FileService from "../../services/FileService";

const { Title, Text } = Typography;

const statusColor = {
  'Chính thức': 'green',
  'Thời vụ': 'orange',
  'Thử việc': 'red',
};

function getStatusLabel(status) {
  switch (status) {
    case STATUS.CHINH_THUC: return STATUS.CHINH_THUC;
    case STATUS.THOI_VU: return STATUS.THOI_VU;
    case STATUS.THU_VIEC: return STATUS.THU_VIEC;
    default: return 'Không xác định';
  }
}

const DocumentManagement = () => {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDocTerm, setSearchDocTerm] = useState("");
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    loadDataEmployees()
  }, []);

  useEffect(() => {
    if (selectedEmp && employees.length > 0) {
      const updatedEmp = employees.find(emp => emp._id === selectedEmp._id);
      if (updatedEmp) setSelectedEmp(updatedEmp);
    }
  }, [employees]);

  const loadDataEmployees = async () => {
    try{
      const response = await DocumentService.getAllEmployeesDocument();
      if(response.success){
        setEmployees(response.data);
      }
    }catch (e) {
      message.error(e.message);
    }
  }

  const empColumns = [
    {
      title: '',
      dataIndex: 'avatar',
      width: 48,
      render: (_, r) => <Avatar icon={<UserOutlined />} style={{ background: '#1976d2' }} />,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      render: (text, r) => <b>{text}</b>,
    },
    {
      title: 'Phòng ban',
      dataIndex: ['departmentId', 'name'],
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Chức vụ',
      dataIndex: ['positionId', 'name'],
    },
    {
      title: 'Trạng thái',
      dataIndex: ['contractId', 'contract_type'],
      render: (status) => <Tag color={statusColor[status]}>{getStatusLabel(status)}</Tag>,
    },
  ];

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
      dataIndex: 'originalName',
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
          <Button icon={<EyeOutlined />} onClick={() => handlePreviewDoc(record)} size="small"></Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleDownloadDoc(record)} size="small" type="primary" ghost></Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteDoc(record)} danger size="small"></Button>
        </Space>
      ),
    },
  ];

  const showAddModal = () => {
    setEditingDoc(null);
    form.resetFields();
    setFiles([])
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try{
      if(files.length === 0) {
        message.error('Vui lòng tải lên ít nhất một tệp tin');
        return;
      }
      let body = {
        employeeId: selectedEmp?._id,
        attachments: files
      };
      const response = await DocumentService.addDocumentForEmployee(body);
      if(response.success){
        message.success(editingDoc ? 'Cập nhật tài liệu thành công' : 'Thêm tài liệu thành công');
      }else {
        message.error(response.message || 'Có lỗi xảy ra khi thêm tài liệu');
      }
    }catch (e) {
      message.error(e.message);
    }finally {
      loadDataEmployees();
      setFiles([])
      setModalVisible(false);
      setEditingDoc(null);
    }
  };

  const handleDownloadDoc = async (doc) => {
    try {
      const blob = await FileService.getFile(doc.key)
      if(blob){
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a');
        link.href = url;
        link.download = doc ? doc.originalName : 'downloadFile';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success('Tải file thành công')
      }else{
        message.error('Tải file thất bại')
      }
    } catch (error) {
      message.error('Tải file thất bại');
    }
  };

  const handleDeleteDoc = (doc) => {
    try{
      Modal.confirm({
        title: 'Xác nhận xóa tài liệu',
        content: `Bạn có chắc chắn muốn xóa tài liệu "${doc.originalName}"?`,
        okText: 'Xóa',
        cancelText: 'Hủy',
        onOk: async () => {
          let body = {
            employeeId: selectedEmp?._id,
            attachments: [doc]
          }
          const response = await DocumentService.deleteDocumentForEmployee(body);
          if(response.success){
            message.success('Xóa tài liệu thành công');
          }else {
            message.error(response.message || 'Có lỗi xảy ra khi xóa tài liệu');
          }
        loadDataEmployees();
        }
      })
    }catch (e) {
        message.error(e.message);
    }
  };

  const handlePreviewDoc = async (doc) => {
    try {
      const blob = await FileService.getFile(doc.key);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        setPreviewFile(doc);
        setPreviewUrl(url);
        setPreviewVisible(true);
      } else {
        message.error('Không thể xem trước file');
      }
    } catch (e) {
      message.error('Không thể xem trước file');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocs = (selectedEmp?.attachments || []).filter(doc =>
    doc.originalName?.toLowerCase().includes(searchDocTerm.toLowerCase())
  );

  return (
    <div style={{ background: 'white', minHeight: '80vh', padding: 24 }}>
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
      <Row gutter={32} style={{ margin: 0, minHeight: '80vh', padding: 10, display: 'flex', alignItems: 'stretch' }}>
        <Col span={11}>
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Danh sách nhân viên</Title>}
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 24px #0001', height: '100%', overflow: 'hidden' }}
          >
            <Input
              placeholder="Tìm kiếm theo tên nhân viên"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginBottom: 12 }}
              allowClear
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Table
                  columns={empColumns}
                  dataSource={filteredEmployees}
                  rowKey="_id"
                  pagination={false}
                  rowClassName={(r) => r._id === selectedEmp?._id ? 'ant-table-row-selected' : ''}
                  onRow={r => ({ onClick: () => setSelectedEmp(r) })}
                  style={{ cursor: 'pointer' }}
                  size="middle"
              />
            </div>
          </Card>
        </Col>
        <Col span={13}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar icon={<UserOutlined />} style={{ background: '#1976d2' }} />
                <div>
                  <b>{selectedEmp?.fullName}</b> <Tag color="blue">{selectedEmp?.departmentId?.name}</Tag>
                  <div style={{ fontSize: 13, color: '#888' }}>{selectedEmp?.positionId?.name}</div>
                </div>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 24px #0001', height: '100%', overflow: 'hidden' }}
            extra={<Button icon={<PlusOutlined />} type="primary" onClick={showAddModal}>Thêm tài liệu</Button>}
          >
            <Input
              placeholder="Tìm kiếm theo tên tài liệu"
              value={searchDocTerm}
              onChange={e => setSearchDocTerm(e.target.value)}
              style={{ marginBottom: 12 }}
              allowClear
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Table
                columns={docColumns}
                dataSource={filteredDocs}
                rowKey="_id"
                pagination={false}
                bordered
                style={{ background: '#fff', borderRadius: 8 }}
                locale={{ emptyText: 'Chưa có tài liệu nào' }}
                size="middle"
              />
            </div>
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
          okButtonProps={{ disabled: files.length === 0 }}
        >
          <Form form={form} layout="vertical" preserve={false}>
            <Form.Item name="attachments" label="Tệp đính kèm" rules={[{ required: true, message: 'Vui lòng upload tệp đính kèm' }]}>
              <UploadFileComponent isSingle={true} files={files} uploadFileSuccess={setFiles}/>
            </Form.Item>
          </Form>
        </Modal>
      </Row>
      <Modal
        open={previewVisible}
        title={`Xem trước: ${previewFile?.originalName}`}
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewUrl('');
          setPreviewFile(null);
        }}
        width={800}
      >
        {previewUrl && (
          previewFile?.originalName?.toLowerCase().endsWith('.pdf') ? (
            <iframe src={previewUrl} width="100%" height="600px" title="preview" />
          ) : (
            <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 600 }} />
          )
        )}
      </Modal>
    </div>
  );
};

export default DocumentManagement; 
