import React, { useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Calendar as AntCalendar,
    Badge,
    Select,
    Button,
    Space,
    Modal,
    Form,
    Input,
    DatePicker,
    Radio,
    TimePicker,
    Tag,
    Tooltip,
    Popover,
    List,
    Divider
} from 'antd';
import {
    PlusOutlined,
    CalendarOutlined,
    TeamOutlined,
    UserOutlined,
    ClockCircleOutlined,
    BellOutlined,
    ScheduleOutlined,
    FileTextOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined,
    UnorderedListOutlined,
    SyncOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ThreeDContainer from '../../components/3d/ThreeDContainer';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

dayjs.locale('vi');

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(() => dayjs());
    const [mode, setMode] = useState('month');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [eventType, setEventType] = useState('meeting');
    const [form] = Form.useForm();

    // Giả lập dữ liệu sự kiện trong lịch
    const events = [
        {
            id: 1,
            title: 'Phỏng vấn Frontend Developer',
            type: 'interview',
            date: '2023-07-10',
            time: '09:00 - 10:30',
            location: 'Phòng họp A',
            participants: ['HR Manager', 'Tech Lead', 'Frontend Developer'],
            description: 'Phỏng vấn ứng viên cho vị trí Frontend Developer',
        },
        {
            id: 2,
            title: 'Họp giao ban HR',
            type: 'meeting',
            date: '2023-07-10',
            time: '14:00 - 15:00',
            location: 'Phòng họp B',
            participants: ['HR Manager', 'HR Officer', 'Recruitment Specialist'],
            description: 'Họp giao ban tuần của phòng HR',
        },
        {
            id: 3,
            title: 'Deadline nộp báo cáo tuyển dụng',
            type: 'deadline',
            date: '2023-07-15',
            time: 'Cả ngày',
            location: '',
            participants: ['HR Manager', 'Recruitment Specialist'],
            description: 'Deadline nộp báo cáo tuyển dụng tháng 6',
        },
        {
            id: 4,
            title: 'Đào tạo nhân viên mới',
            type: 'training',
            date: '2023-07-17',
            time: '09:00 - 16:00',
            location: 'Phòng đào tạo',
            participants: ['HR Officer', 'New Employees'],
            description: 'Đào tạo nhân viên mới về quy trình làm việc và văn hóa công ty',
        },
        {
            id: 5,
            title: 'Phỏng vấn UI/UX Designer',
            type: 'interview',
            date: '2023-07-18',
            time: '10:00 - 11:30',
            location: 'Phòng họp A',
            participants: ['HR Manager', 'Design Lead', 'Senior Designer'],
            description: 'Phỏng vấn ứng viên cho vị trí UI/UX Designer',
        },
        {
            id: 6,
            title: 'Buổi đánh giá hiệu quả công việc',
            type: 'review',
            date: '2023-07-20',
            time: '13:00 - 17:00',
            location: 'Phòng họp lớn',
            participants: ['HR Manager', 'Department Managers'],
            description: 'Đánh giá hiệu quả công việc của nhân viên quý II',
        },
        {
            id: 7,
            title: 'Workshop phát triển kỹ năng lãnh đạo',
            type: 'workshop',
            date: '2023-07-25',
            time: '09:00 - 12:00',
            location: 'Phòng đào tạo',
            participants: ['HR Manager', 'Department Managers', 'Team Leaders'],
            description: 'Workshop phát triển kỹ năng lãnh đạo cho cấp quản lý',
        },
        {
            id: 8,
            title: 'Khám sức khỏe định kỳ',
            type: 'health',
            date: '2023-07-27',
            time: 'Cả ngày',
            location: 'Bệnh viện Việt Pháp',
            participants: ['Tất cả nhân viên'],
            description: 'Khám sức khỏe định kỳ cho nhân viên',
        },
        {
            id: 9,
            title: 'Ngày nghỉ lễ: Ngày Thương binh Liệt sĩ',
            type: 'holiday',
            date: '2023-07-27',
            time: 'Cả ngày',
            location: '',
            participants: ['Tất cả nhân viên'],
            description: 'Ngày nghỉ lễ: Ngày Thương binh Liệt sĩ 27/7',
        },
        {
            id: 10,
            title: 'Team building phòng HR',
            type: 'teambuilding',
            date: '2023-07-29',
            time: 'Cả ngày',
            location: 'Resort Flamingo Đại Lải',
            participants: ['Tất cả nhân viên HR'],
            description: 'Hoạt động team building phòng HR quý III',
        }
    ];

    // Lấy sự kiện theo ngày
    const getEventsForDate = (date) => {
        return events.filter(event => dayjs(event.date).isSame(date, 'day'));
    };

    // Hiển thị dữ liệu trên ô lịch
    const dateCellRender = (value) => {
        const listData = getEventsForDate(value);

        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {listData.map((item) => (
                    <li key={item.id} style={{ marginBottom: '3px' }}>
                        <Badge
                            status={getEventStatusColor(item.type)}
                            text={
                                <Tooltip title={`${item.title} - ${item.time}`}>
                                    <span style={{ fontSize: '12px' }}>{item.title.length > 14 ? `${item.title.substring(0, 14)}...` : item.title}</span>
                                </Tooltip>
                            }
                        />
                    </li>
                ))}
            </ul>
        );
    };

    // Lấy màu trạng thái theo loại sự kiện
    const getEventStatusColor = (type) => {
        switch(type) {
            case 'meeting': return 'processing';
            case 'interview': return 'warning';
            case 'deadline': return 'error';
            case 'training': return 'success';
            case 'holiday': return 'default';
            case 'workshop': return 'purple';
            case 'review': return 'cyan';
            case 'health': return 'blue';
            case 'teambuilding': return 'orange';
            default: return 'default';
        }
    };

    // Lấy tag màu theo loại sự kiện
    const getEventTypeTag = (type) => {
        switch(type) {
            case 'meeting': return <Tag color="blue">Họp</Tag>;
            case 'interview': return <Tag color="orange">Phỏng vấn</Tag>;
            case 'deadline': return <Tag color="red">Deadline</Tag>;
            case 'training': return <Tag color="green">Đào tạo</Tag>;
            case 'holiday': return <Tag>Ngày nghỉ</Tag>;
            case 'workshop': return <Tag color="purple">Workshop</Tag>;
            case 'review': return <Tag color="cyan">Đánh giá</Tag>;
            case 'health': return <Tag color="blue">Y tế</Tag>;
            case 'teambuilding': return <Tag color="orange">Team building</Tag>;
            default: return <Tag>Khác</Tag>;
        }
    };

    // Hiển thị thông tin đầy đủ cho ngày đã chọn
    const renderSelectedDateEvents = () => {
        const dateEvents = getEventsForDate(selectedDate);

        if (dateEvents.length === 0) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Text type="secondary">Không có sự kiện nào vào ngày này</Text>
                </div>
            );
        }

        return (
            <List
                itemLayout="horizontal"
                dataSource={dateEvents}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="text" icon={<EditOutlined />} />,
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge
                                    count={
                                        <div
                                            style={{
                                                width: 6,
                                                height: 6,
                                                background: getBadgeColor(item.type),
                                                borderRadius: '50%',
                                                display: 'block',
                                            }}
                                        />
                                    }
                                    offset={[0, 0]}
                                >
                                    <Avatar icon={getEventIcon(item.type)} style={{ backgroundColor: getBadgeColor(item.type) }} />
                                </Badge>
                            }
                            title={
                                <Space>
                                    <Text strong>{item.title}</Text>
                                    {getEventTypeTag(item.type)}
                                </Space>
                            }
                            description={
                                <div>
                                    <div><ClockCircleOutlined /> {item.time}</div>
                                    {item.location && <div><EnvironmentOutlined /> {item.location}</div>}
                                </div>
                            }
                        />
                        <Popover
                            content={
                                <div style={{ maxWidth: 300 }}>
                                    <Paragraph>{item.description}</Paragraph>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div>
                                        <Text strong>Người tham gia:</Text>
                                        <div>
                                            {item.participants.map((participant, index) => (
                                                <Tag key={index}>{participant}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            title="Chi tiết sự kiện"
                            trigger="click"
                        >
                            <Button type="text" icon={<InfoCircleOutlined />} />
                        </Popover>
                    </List.Item>
                )}
            />
        );
    };

    // Lấy màu cho badge
    const getBadgeColor = (type) => {
        switch(type) {
            case 'meeting': return '#1890ff';
            case 'interview': return '#faad14';
            case 'deadline': return '#ff4d4f';
            case 'training': return '#52c41a';
            case 'holiday': return '#d9d9d9';
            case 'workshop': return '#722ed1';
            case 'review': return '#13c2c2';
            case 'health': return '#1890ff';
            case 'teambuilding': return '#fa8c16';
            default: return '#d9d9d9';
        }
    };

    // Lấy icon cho loại sự kiện
    const getEventIcon = (type) => {
        switch(type) {
            case 'meeting': return <TeamOutlined />;
            case 'interview': return <UserOutlined />;
            case 'deadline': return <ClockCircleOutlined />;
            case 'training': return <FileTextOutlined />;
            case 'holiday': return <CalendarOutlined />;
            case 'workshop': return <TeamOutlined />;
            case 'review': return <FileTextOutlined />;
            case 'health': return <FileTextOutlined />;
            case 'teambuilding': return <TeamOutlined />;
            default: return <CalendarOutlined />;
        }
    };

    // Hiển thị modal tạo sự kiện mới
    const showModal = () => {
        form.resetFields();
        form.setFieldsValue({ type: 'meeting', date: selectedDate, time: [dayjs('09:00', 'HH:mm'), dayjs('10:00', 'HH:mm')] });
        setEventType('meeting');
        setIsModalVisible(true);
    };

    const handleEventTypeChange = (value) => {
        setEventType(value);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log('Form values:', values);
            // Ở đây bạn sẽ xử lý việc thêm sự kiện mới vào danh sách
            setIsModalVisible(false);
        });
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Title level={2}>Lịch HR</Title>
                    <Text type="secondary">Quản lý lịch họp, phỏng vấn, đào tạo và các sự kiện của phòng nhân sự</Text>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <ThreeDContainer>
                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Lịch sự kiện</span>
                                    <Space>
                                        <Select defaultValue="month" style={{ width: 120 }} onChange={setMode}>
                                            <Option value="month">Tháng</Option>
                                            <Option value="year">Năm</Option>
                                        </Select>
                                        <Select defaultValue="all" style={{ width: 150 }}>
                                            <Option value="all">Tất cả sự kiện</Option>
                                            <Option value="meeting">Họp</Option>
                                            <Option value="interview">Phỏng vấn</Option>
                                            <Option value="deadline">Deadline</Option>
                                            <Option value="training">Đào tạo</Option>
                                        </Select>
                                        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                                            Thêm sự kiện
                                        </Button>
                                    </Space>
                                </div>
                            }
                            bodyStyle={{ padding: 0 }}
                        >
                            <AntCalendar
                                mode={mode}
                                value={selectedDate}
                                onSelect={setSelectedDate}
                                dateCellRender={dateCellRender}
                                headerRender={({ value, type, onChange, onTypeChange }) => {
                                    const start = 0;
                                    const end = 12;
                                    const monthOptions = [];

                                    const current = value.clone();
                                    const localeData = value.localeData();
                                    const months = [];
                                    for (let i = 0; i < 12; i++) {
                                        current.month(i);
                                        months.push(localeData.monthsShort(current));
                                    }

                                    for (let index = start; index < end; index++) {
                                        monthOptions.push(
                                            <Select.Option className="month-item" key={`${index}`}>
                                                {months[index]}
                                            </Select.Option>,
                                        );
                                    }
                                    const month = value.month();

                                    const year = value.year();
                                    const options = [];
                                    for (let i = year - 10; i < year + 10; i += 1) {
                                        options.push(
                                            <Select.Option key={i} value={i} className="year-item">
                                                {i}
                                            </Select.Option>,
                                        );
                                    }
                                    return (
                                        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <Button
                                                    type="text"
                                                    onClick={() => onChange(value.clone().subtract(1, mode === 'year' ? 'year' : 'month'))}
                                                >
                                                    Trước
                                                </Button>
                                                <Button
                                                    type="text"
                                                    onClick={() => onChange(dayjs())}
                                                >
                                                    Hôm nay
                                                </Button>
                                                <Button
                                                    type="text"
                                                    onClick={() => onChange(value.clone().add(1, mode === 'year' ? 'year' : 'month'))}
                                                >
                                                    Sau
                                                </Button>
                                            </div>
                                            <div>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    value={String(month)}
                                                    onChange={selectedMonth => {
                                                        const newValue = value.clone().month(parseInt(selectedMonth, 10));
                                                        onChange(newValue);
                                                    }}
                                                >
                                                    {monthOptions}
                                                </Select>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    className="my-year-select"
                                                    onChange={newYear => {
                                                        const now = value.clone().year(newYear);
                                                        onChange(now);
                                                    }}
                                                    value={String(year)}
                                                >
                                                    {options}
                                                </Select>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} lg={8}>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <ThreeDContainer>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <CalendarOutlined /> {selectedDate.format('DD/MM/YYYY')}
                      </span>
                                            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={showModal}>
                                                Thêm
                                            </Button>
                                        </div>
                                    }
                                    style={{ marginBottom: '16px' }}
                                >
                                    {renderSelectedDateEvents()}
                                </Card>
                            </ThreeDContainer>
                        </Col>

                        <Col span={24}>
                            <ThreeDContainer>
                                <Card title="Sự kiện sắp tới">
                                    <List
                                        size="small"
                                        dataSource={events.filter(event =>
                                            dayjs(event.date).isAfter(dayjs(), 'day') &&
                                            dayjs(event.date).isBefore(dayjs().add(7, 'day'), 'day')
                                        ).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Badge
                                                            dot
                                                            offset={[0, 0]}
                                                            color={getBadgeColor(item.type)}
                                                        >
                                                            <Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#f0f0f0', color: '#666' }} />
                                                        </Badge>
                                                    }
                                                    title={item.title}
                                                    description={
                                                        <Space direction="vertical" size={0}>
                                                            <Text type="secondary">{dayjs(item.date).format('DD/MM/YYYY')} - {item.time}</Text>
                                                            {item.location && <Text type="secondary"><EnvironmentOutlined /> {item.location}</Text>}
                                                        </Space>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </ThreeDContainer>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Modal
                title="Thêm sự kiện mới"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmit}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề sự kiện"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sự kiện' }]}
                    >
                        <Input placeholder="Nhập tiêu đề sự kiện" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại sự kiện"
                        rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện' }]}
                    >
                        <Select onChange={handleEventTypeChange}>
                            <Option value="meeting">Họp</Option>
                            <Option value="interview">Phỏng vấn</Option>
                            <Option value="deadline">Deadline</Option>
                            <Option value="training">Đào tạo</Option>
                            <Option value="holiday">Ngày nghỉ</Option>
                            <Option value="workshop">Workshop</Option>
                            <Option value="review">Đánh giá</Option>
                            <Option value="teambuilding">Team building</Option>
                            <Option value="health">Y tế</Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Ngày"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="allDay"
                                label="Thời gian"
                                valuePropName="checked"
                            >
                                <Radio.Group defaultValue={false}>
                                    <Radio value={false}>Giờ cụ thể</Radio>
                                    <Radio value={true}>Cả ngày</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="time"
                        label="Thời gian"
                        dependencies={['allDay']}
                        rules={[
                            ({ getFieldValue }) => ({
                                required: !getFieldValue('allDay'),
                                message: 'Vui lòng chọn thời gian'
                            })
                        ]}
                        noStyle={form.getFieldValue('allDay')}
                    >
                        <TimePicker.RangePicker
                            style={{ width: '100%' }}
                            format="HH:mm"
                            disabled={form.getFieldValue('allDay')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Địa điểm"
                    >
                        <Input placeholder="Nhập địa điểm" />
                    </Form.Item>

                    <Form.Item
                        name="participants"
                        label="Người tham gia"
                    >
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm người tham gia">
                            <Option value="HR Manager">HR Manager</Option>
                            <Option value="HR Officer">HR Officer</Option>
                            <Option value="Recruitment Specialist">Recruitment Specialist</Option>
                            <Option value="Department Managers">Department Managers</Option>
                            <Option value="Team Leaders">Team Leaders</Option>
                            <Option value="Tất cả nhân viên">Tất cả nhân viên</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả sự kiện" />
                    </Form.Item>

                    {eventType === 'interview' && (
                        <>
                            <Divider orientation="left">Thông tin phỏng vấn</Divider>
                            <Form.Item
                                name="candidate"
                                label="Ứng viên"
                            >
                                <Input placeholder="Tên ứng viên" />
                            </Form.Item>
                            <Form.Item
                                name="position"
                                label="Vị trí ứng tuyển"
                            >
                                <Input placeholder="Vị trí ứng tuyển" />
                            </Form.Item>
                        </>
                    )}

                    {eventType === 'meeting' && (
                        <>
                            <Divider orientation="left">Thông tin cuộc họp</Divider>
                            <Form.Item
                                name="agenda"
                                label="Nội dung cuộc họp"
                            >
                                <TextArea rows={4} placeholder="Nhập nội dung cuộc họp" />
                            </Form.Item>
                            <Form.Item
                                name="preparation"
                                label="Chuẩn bị"
                            >
                                <TextArea rows={2} placeholder="Những việc cần chuẩn bị" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="reminder"
                        label="Nhắc nhở"
                    >
                        <Select defaultValue="15">
                            <Option value="0">Không nhắc nhở</Option>
                            <Option value="5">5 phút trước</Option>
                            <Option value="15">15 phút trước</Option>
                            <Option value="30">30 phút trước</Option>
                            <Option value="60">1 giờ trước</Option>
                            <Option value="1440">1 ngày trước</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Calendar;
