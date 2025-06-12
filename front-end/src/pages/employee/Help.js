import React, { useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Collapse,
    List,
    Space,
    Input,
    Button,
    Divider,
    Tag,
    Tabs,
    Empty,
    Avatar,
    Table
} from 'antd';
import {
    QuestionCircleOutlined,
    SearchOutlined,
    DownloadOutlined,
    FileTextOutlined,
    BookOutlined,
    FilePdfOutlined,
    SolutionOutlined,
    TeamOutlined,
    ScheduleOutlined,
    DollarOutlined,
    BarsOutlined,
    ContactsOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

const Help = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [searchText, setSearchText] = useState('');

    // Sample FAQs
    const faqs = [
        {
            question: 'Làm thế nào để duyệt đơn xin nghỉ phép?',
            answer: 'Để duyệt đơn xin nghỉ phép, hãy truy cập vào phần "Duyệt nghỉ phép" trong menu. Tại đây bạn sẽ thấy danh sách các đơn đang chờ duyệt. Nhấn vào nút "Duyệt" để chấp nhận hoặc "Từ chối" kèm theo lý do từ chối.',
            category: 'leave',
            views: 245
        },
        {
            question: 'Tôi cần thêm một nhân viên mới vào hệ thống như thế nào?',
            answer: 'Để thêm nhân viên mới, vui lòng truy cập mục "Quản lý nhân sự", sau đó nhấn nút "Thêm nhân viên". Điền đầy đủ thông tin cá nhân, vị trí, phòng ban và các thông tin khác theo mẫu. Sau khi hoàn tất, nhấn "Lưu" để thêm nhân viên vào hệ thống.',
            category: 'staff',
            views: 320
        },
        {
            question: 'Làm thế nào để tạo một hợp đồng mới?',
            answer: 'Để tạo hợp đồng mới, vào mục "Quản lý hợp đồng" và nhấn nút "Tạo hợp đồng". Chọn nhân viên, loại hợp đồng, nhập thời hạn, lương và các điều khoản. Sau đó nhấn "Tạo" để lưu hợp đồng mới.',
            category: 'contract',
            views: 178
        },
        {
            question: 'Làm thế nào để xem báo cáo tổng hợp về nhân sự?',
            answer: 'Để xem báo cáo tổng hợp về nhân sự, vui lòng vào mục "Báo cáo HR". Tại đây bạn có thể chọn loại báo cáo cần xem như báo cáo nhân sự, báo cáo tuyển dụng, báo cáo lương thưởng hoặc báo cáo chấm công.',
            category: 'report',
            views: 156
        },
        {
            question: 'Cách duyệt dữ liệu chấm công có vấn đề?',
            answer: 'Để duyệt dữ liệu chấm công có vấn đề, vào mục "Duyệt chấm công" và chọn tab "Cần duyệt". Xem xét chi tiết từng trường hợp, sau đó có thể chỉnh sửa thời gian check-in/check-out nếu cần và nhấn "Duyệt" hoặc "Từ chối".',
            category: 'attendance',
            views: 210
        },
        {
            question: 'Làm thế nào để điều chỉnh lương nhân viên?',
            answer: 'Để điều chỉnh lương nhân viên, vào mục "Quản lý lương thưởng", tìm nhân viên cần điều chỉnh, nhấn vào biểu tượng chỉnh sửa. Nhập mức lương mới và lý do điều chỉnh, sau đó nhấn "Lưu" để cập nhật.',
            category: 'payroll',
            views: 189
        },
        {
            question: 'Làm thế nào để thêm một vị trí tuyển dụng mới?',
            answer: 'Để thêm vị trí tuyển dụng mới, vào mục "Tuyển dụng" và nhấn nút "Thêm vị trí". Nhập thông tin về vị trí, số lượng cần tuyển, yêu cầu, mức lương và thời gian tuyển. Sau đó nhấn "Lưu" để tạo vị trí tuyển dụng mới.',
            category: 'recruitment',
            views: 145
        }
    ];

    // Sample tutorials
    const tutorials = [
        {
            title: 'Hướng dẫn sử dụng hệ thống HR',
            description: 'Tổng quan về các chức năng cơ bản của hệ thống quản lý nhân sự',
            category: 'general',
            type: 'video',
            url: '#',
            duration: '10:25'
        },
        {
            title: 'Cách quản lý hợp đồng hiệu quả',
            description: 'Hướng dẫn chi tiết về quy trình tạo, gia hạn và chấm dứt hợp đồng',
            category: 'contract',
            type: 'document',
            url: '#',
            pages: 15
        },
        {
            title: 'Quy trình duyệt chấm công',
            description: 'Các bước duyệt dữ liệu chấm công và xử lý các trường hợp đặc biệt',
            category: 'attendance',
            type: 'video',
            url: '#',
            duration: '8:30'
        },
        {
            title: 'Hướng dẫn tính lương và phụ cấp',
            description: 'Cách thức tính lương, thưởng và các khoản phụ cấp cho nhân viên',
            category: 'payroll',
            type: 'document',
            url: '#',
            pages: 22
        },
        {
            title: 'Quy trình tuyển dụng từ A-Z',
            description: 'Hướng dẫn đầy đủ về quy trình tuyển dụng từ đăng tin đến onboarding',
            category: 'recruitment',
            type: 'video',
            url: '#',
            duration: '15:45'
        }
    ];

    // Sample documents
    const documents = [
        {
            title: 'Sổ tay nhân viên',
            description: 'Tài liệu hướng dẫn cho nhân viên mới về quy định, chính sách công ty',
            category: 'policy',
            type: 'pdf',
            url: '#',
            size: '2.3 MB'
        },
        {
            title: 'Mẫu hợp đồng lao động',
            description: 'Các mẫu hợp đồng lao động theo quy định mới nhất',
            category: 'contract',
            type: 'docx',
            url: '#',
            size: '540 KB'
        },
        {
            title: 'Quy trình đánh giá hiệu suất',
            description: 'Tài liệu hướng dẫn quy trình đánh giá hiệu suất nhân viên',
            category: 'performance',
            type: 'pdf',
            url: '#',
            size: '1.8 MB'
        },
        {
            title: 'Biểu mẫu yêu cầu tuyển dụng',
            description: 'Mẫu đơn yêu cầu tuyển dụng nhân sự mới từ các phòng ban',
            category: 'recruitment',
            type: 'xlsx',
            url: '#',
            size: '320 KB'
        },
        {
            title: 'Quy định về nghỉ phép',
            description: 'Tài liệu chi tiết về các loại nghỉ phép và quy định áp dụng',
            category: 'leave',
            type: 'pdf',
            url: '#',
            size: '1.2 MB'
        }
    ];

    // Sample support contacts
    const supportContacts = [
        {
            name: 'Nguyễn Văn Hỗ Trợ',
            position: 'IT Support Manager',
            department: 'IT Department',
            email: 'support@company.com',
            phone: '0912345678',
            avatar: null
        },
        {
            name: 'Trần Thị Hướng Dẫn',
            position: 'HR Training Specialist',
            department: 'HR Department',
            email: 'training@company.com',
            phone: '0923456789',
            avatar: null
        },
        {
            name: 'Lê Văn Kỹ Thuật',
            position: 'System Administrator',
            department: 'IT Department',
            email: 'sysadmin@company.com',
            phone: '0934567890',
            avatar: null
        }
    ];

    const getTypeIcon = (type) => {
        switch(type) {
            case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
            case 'docx': return <FileTextOutlined style={{ color: '#1890ff' }} />;
            case 'xlsx': return <FileTextOutlined style={{ color: '#52c41a' }} />;
            case 'video': return <VideoCameraOutlined style={{ color: '#faad14' }} />;
            case 'document': return <BookOutlined style={{ color: '#722ed1' }} />;
            default: return <FileTextOutlined />;
        }
    };

    const getCategoryTag = (category) => {
        switch(category) {
            case 'general': return <Tag color="blue">Tổng quan</Tag>;
            case 'leave': return <Tag color="orange">Nghỉ phép</Tag>;
            case 'staff': return <Tag color="green">Nhân sự</Tag>;
            case 'contract': return <Tag color="purple">Hợp đồng</Tag>;
            case 'attendance': return <Tag color="cyan">Chấm công</Tag>;
            case 'payroll': return <Tag color="red">Lương thưởng</Tag>;
            case 'recruitment': return <Tag color="magenta">Tuyển dụng</Tag>;
            case 'report': return <Tag color="geekblue">Báo cáo</Tag>;
            case 'policy': return <Tag color="volcano">Chính sách</Tag>;
            case 'performance': return <Tag color="gold">Hiệu suất</Tag>;
            default: return <Tag>Khác</Tag>;
        }
    };

    // Filter data based on search
    const filteredFaqs = faqs.filter(item =>
        item.question.toLowerCase().includes(searchText.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredTutorials = tutorials.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredDocuments = documents.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Table columns for quick access
    const quickAccessColumns = [
        {
            title: 'Chức năng',
            dataIndex: 'feature',
            key: 'feature',
            render: (text, record) => (
                <Space>
                    {record.icon}
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Truy cập nhanh',
            key: 'access',
            render: (_, record) => (
                <Button type="primary" size="small" href={record.url}>
                    Truy cập
                </Button>
            )
        }
    ];

    // Data for quick access table
    const quickAccessData = [
        {
            key: '1',
            feature: 'Quản lý nhân sự',
            icon: <TeamOutlined style={{ color: '#1890ff' }} />,
            description: 'Quản lý thông tin nhân viên, phòng ban',
            url: '/hr/staff-management'
        },
        {
            key: '2',
            feature: 'Quản lý hợp đồng',
            icon: <SolutionOutlined style={{ color: '#722ed1' }} />,
            description: 'Tạo và quản lý hợp đồng lao động',
            url: '/hr/contracts'
        },
        {
            key: '3',
            feature: 'Duyệt nghỉ phép',
            icon: <ScheduleOutlined style={{ color: '#fa8c16' }} />,
            description: 'Xem và duyệt các đơn xin nghỉ phép',
            url: '/hr/leave-approvals'
        },
        {
            key: '4',
            feature: 'Duyệt chấm công',
            icon: <BarsOutlined style={{ color: '#13c2c2' }} />,
            description: 'Xem và duyệt dữ liệu chấm công',
            url: '/hr/attendance-review'
        },
        {
            key: '5',
            feature: 'Quản lý lương',
            icon: <DollarOutlined style={{ color: '#52c41a' }} />,
            description: 'Quản lý lương và phụ cấp',
            url: '/hr/payroll-management'
        },
        {
            key: '6',
            feature: 'Báo cáo HR',
            icon: <FileTextOutlined style={{ color: '#f5222d' }} />,
            description: 'Xem các báo cáo nhân sự',
            url: '/hr/reports'
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Title level={2}>Trợ giúp</Title>
                    <Text type="secondary">Hướng dẫn sử dụng và các câu hỏi thường gặp</Text>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <ThreeDContainer>
                        <Card>
                            <Search
                                placeholder="Tìm kiếm câu hỏi, hướng dẫn, tài liệu..."
                                allowClear
                                enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                                size="large"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: '100%', marginBottom: '16px' }}
                            />

                            <Table
                                columns={quickAccessColumns}
                                dataSource={quickAccessData}
                                pagination={false}
                                title={() => <Text strong>Truy cập nhanh</Text>}
                                size="small"
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab={<span><QuestionCircleOutlined /> Câu hỏi thường gặp</span>} key="1">
                        <Card>
                            {filteredFaqs.length > 0 ? (
                                <Collapse accordion>
                                    {filteredFaqs.map((faq, index) => (
                                        <Panel
                                            header={
                                                <Space>
                                                    <span>{faq.question}</span>
                                                    {getCategoryTag(faq.category)}
                                                </Space>
                                            }
                                            key={index}
                                        >
                                            <Paragraph>{faq.answer}</Paragraph>
                                            <div style={{ textAlign: 'right' }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {faq.views} lượt xem
                                                </Text>
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            ) : (
                                <Empty
                                    description="Không tìm thấy câu hỏi phù hợp"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><BookOutlined /> Hướng dẫn sử dụng</span>} key="2">
                        <Card>
                            {filteredTutorials.length > 0 ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={filteredTutorials}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[
                                                <Button type="primary" href={item.url}>Xem hướng dẫn</Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={getTypeIcon(item.type)}
                                                title={
                                                    <Space>
                                                        <span>{item.title}</span>
                                                        {getCategoryTag(item.category)}
                                                    </Space>
                                                }
                                                description={
                                                    <div>
                                                        <Paragraph>{item.description}</Paragraph>
                                                        <Text type="secondary">
                                                            {item.type === 'video' ? `Thời lượng: ${item.duration}` : `Số trang: ${item.pages}`}
                                                        </Text>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty
                                    description="Không tìm thấy hướng dẫn phù hợp"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><FileTextOutlined /> Tài liệu & Biểu mẫu</span>} key="3">
                        <Card>
                            {filteredDocuments.length > 0 ? (
                                <List
                                    grid={{ gutter: 16, column: 3 }}
                                    dataSource={filteredDocuments}
                                    renderItem={item => (
                                        <List.Item>
                                            <Card
                                                hoverable
                                                actions={[
                                                    <Button type="link" href={item.url} icon={<DownloadOutlined />}>
                                                        Tải xuống
                                                    </Button>
                                                ]}
                                            >
                                                <Card.Meta
                                                    avatar={getTypeIcon(item.type)}
                                                    title={
                                                        <Space direction="vertical" size={0}>
                                                            <span>{item.title}</span>
                                                            <div style={{ marginTop: 4 }}>
                                                                {getCategoryTag(item.category)}
                                                                <Tag color="default">{item.type.toUpperCase()}</Tag>
                                                                <Tag color="default">{item.size}</Tag>
                                                            </div>
                                                        </Space>
                                                    }
                                                    description={item.description}
                                                />
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty
                                    description="Không tìm thấy tài liệu phù hợp"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><ContactsOutlined /> Liên hệ hỗ trợ</span>} key="4">
                        <Card>
                            <List
                                itemLayout="horizontal"
                                dataSource={supportContacts}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} src={item.avatar} size={64} />}
                                            title={<Text strong style={{ fontSize: 16 }}>{item.name}</Text>}
                                            description={
                                                <Space direction="vertical" size={2}>
                                                    <Text>{item.position} - {item.department}</Text>
                                                    <Space>
                                                        <Text type="secondary">Email:</Text>
                                                        <a href={`mailto:${item.email}`}>{item.email}</a>
                                                    </Space>
                                                    <Space>
                                                        <Text type="secondary">Điện thoại:</Text>
                                                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                                                    </Space>
                                                </Space>
                                            }
                                        />
                                        <Button type="primary">Liên hệ ngay</Button>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>
        </div>
    );
};

export default Help;
