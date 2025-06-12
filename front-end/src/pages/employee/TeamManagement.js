import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Tag, Modal, Form, Select, Typography, Avatar, Row, Col, Divider, Tooltip } from 'antd';
import { UserAddOutlined, SearchOutlined, TeamOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingTeamId, setEditingTeamId] = useState(null);

    // Mock data
    useEffect(() => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setTeams([
                {
                    id: 1,
                    name: 'Phát triển phần mềm',
                    description: 'Nhóm phát triển sản phẩm phần mềm chính',
                    leader: {
                        id: 101,
                        name: 'Nguyễn Văn A',
                        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                    },
                    members: 8,
                    projects: 3,
                    status: 'active',
                },
                {
                    id: 2,
                    name: 'Thiết kế UI/UX',
                    description: 'Nhóm thiết kế giao diện người dùng',
                    leader: {
                        id: 102,
                        name: 'Trần Thị B',
                        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                    },
                    members: 5,
                    projects: 4,
                    status: 'active',
                },
                {
                    id: 3,
                    name: 'Kiểm thử',
                    description: 'Nhóm kiểm thử và đảm bảo chất lượng',
                    leader: {
                        id: 103,
                        name: 'Lê Văn C',
                        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                    },
                    members: 6,
                    projects: 3,
                    status: 'active',
                },
                {
                    id: 4,
                    name: 'Hạ tầng & DevOps',
                    description: 'Nhóm quản lý hạ tầng và tự động hóa',
                    leader: {
                        id: 104,
                        name: 'Phạm Thị D',
                        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                    },
                    members: 4,
                    projects: 2,
                    status: 'active',
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchText.toLowerCase()) ||
        team.description.toLowerCase().includes(searchText.toLowerCase()) ||
        team.leader.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const showModal = (teamId = null) => {
        setEditingTeamId(teamId);
        if (teamId) {
            const team = teams.find(t => t.id === teamId);
            form.setFieldsValue({
                name: team.name,
                description: team.description,
                leader: team.leader.id,
                status: team.status,
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        if (editingTeamId) {
            // Update existing team
            const updatedTeams = teams.map(team =>
                team.id === editingTeamId ? { ...team, ...values } : team
            );
            setTeams(updatedTeams);
        } else {
            // Create new team
            const newTeam = {
                id: teams.length + 1,
                ...values,
                leader: {
                    id: values.leader,
                    name: values.leader === 101 ? 'Nguyễn Văn A' :
                        values.leader === 102 ? 'Trần Thị B' :
                            values.leader === 103 ? 'Lê Văn C' : 'Phạm Thị D',
                    avatar: `https://randomuser.me/api/portraits/${values.leader % 2 === 1 ? 'men' : 'women'}/${values.leader - 100}.jpg`,
                },
                members: 1,
                projects: 0,
            };
            setTeams([...teams, newTeam]);
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Tên nhóm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<TeamOutlined />}
                    />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Trưởng nhóm',
            dataIndex: 'leader',
            key: 'leader',
            render: (leader) => (
                <Space>
                    <Avatar src={leader.avatar} icon={<UserOutlined />} />
                    {leader.name}
                </Space>
            ),
        },
        {
            title: 'Số thành viên',
            dataIndex: 'members',
            key: 'members',
            sorter: (a, b) => a.members - b.members,
        },
        {
            title: 'Số dự án',
            dataIndex: 'projects',
            key: 'projects',
            sorter: (a, b) => a.projects - b.projects,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>
                <TeamOutlined /> Quản lý đội nhóm
            </Title>
            <Divider />

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Tooltip title="Tổng số nhóm">
                            <Title level={2} style={{ margin: 0 }}>{teams.length}</Title>
                            <Text type="secondary">Tổng số nhóm</Text>
                        </Tooltip>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Tooltip title="Tổng số thành viên">
                            <Title level={2} style={{ margin: 0 }}>
                                {teams.reduce((sum, team) => sum + team.members, 0)}
                            </Title>
                            <Text type="secondary">Tổng số thành viên</Text>
                        </Tooltip>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Tooltip title="Tổng số dự án">
                            <Title level={2} style={{ margin: 0 }}>
                                {teams.reduce((sum, team) => sum + team.projects, 0)}
                            </Title>
                            <Text type="secondary">Tổng số dự án</Text>
                        </Tooltip>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Tooltip title="Hiệu suất trung bình">
                            <Title level={2} style={{ margin: 0 }}>87%</Title>
                            <Text type="secondary">Hiệu suất trung bình</Text>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>

            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Input.Search
                        placeholder="Tìm kiếm nhóm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm nhóm mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredTeams}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhóm`,
                    }}
                />
            </Card>

            <Modal
                title={editingTeamId ? "Chỉnh sửa nhóm" : "Thêm nhóm mới"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên nhóm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
                    >
                        <Input placeholder="Nhập tên nhóm" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả nhóm!' }]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả nhóm" rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="leader"
                        label="Trưởng nhóm"
                        rules={[{ required: true, message: 'Vui lòng chọn trưởng nhóm!' }]}
                    >
                        <Select placeholder="Chọn trưởng nhóm">
                            <Option value={101}>Nguyễn Văn A</Option>
                            <Option value={102}>Trần Thị B</Option>
                            <Option value={103}>Lê Văn C</Option>
                            <Option value={104}>Phạm Thị D</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        initialValue="active"
                    >
                        <Select>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Tạm dừng</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingTeamId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeamManagement;
