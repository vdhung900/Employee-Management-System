import {useEffect, useState} from 'react';
import {
    Card,
    Typography,
    Form,
    Input,
    Button,
    Switch,
    Select,
    Tabs,
    Row,
    Col,
    TimePicker,
    InputNumber,
    Radio,
    Space,
    message,
    Alert,
    Table,
    Modal,
    Tag
} from 'antd';
import {
    SettingOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import SystemService from "../../services/SystemService";
import {STATUS} from "../../constants/Status";

const {Title, Text} = Typography;
const {TabPane} = Tabs;

const AdminSettings = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState(STATUS.WORKING_TIME_SETTINGS);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEditingType, setCurrentEditingType] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [salaryData, setSalaryData] = useState([]);

    const leaveData = [
        {
            key: '1',
            annualLeave: 12,
            sickLeave: 30,
            personalLeave: 3,
            maternityLeave: 180,
            paternityLeave: 14,
            carryOverDays: 5,
            holidayWorkMultiplier: 3,
            weekendWorkMultiplier: 2,
        }
    ];

    useEffect(() => {
        loadDataByCode(activeTab)
    }, [activeTab]);

    const loadDataByCode = async (activeTab) => {
        try {
            let body = {
                type: activeTab
            }
            const response = await SystemService.getSystemSettingByCode(body);
            if (response.success) {
                if(activeTab === STATUS.WORKING_TIME_SETTINGS){
                    setAttendanceData(response.data);
                } else if(activeTab === STATUS.SALARY_SETTINGS) {
                    const salaryData = response.data.map(item => ({
                        key: item._id,
                        workingDaysPerMonth: item.value.working_days_per_month.value,
                        latePenalty: item.value.late_penalty_per_minute.value,
                        overtimeNormal: item.value.overtime_rate_normal.percent,
                        overtimeWeekend: item.value.overtime_rate_weekend.percent,
                        overtimeHoliday: item.value.overtime_rate_holidays.percent,
                        bhxhTotal: item.value.bhxh_percent.total,
                        bhxh: item.value.bhxh_percent.bhxh,
                        bhyt: item.value.bhxh_percent.bhyt,
                        bhtn: item.value.bhxh_percent.bhtn,
                        personalDeduction: item.value.tax_personal_deduction.value,
                        dependentDeduction: item.value.tax_dependent_deduction.value,
                        taxBrackets: item.value.tax_brackets.value
                    }));
                    setSalaryData(salaryData);
                }
            }
        } catch (e) {
            message.error(e.message);
        }
    }

    const onChangeTab = (key) => {
        try {
            setActiveTab(key);
        } catch (e) {
            message.error("Error when changing tab: " + e.message);
        }
    }

    const renderWorkingDays = (workingDays) => {
        // workingDays là mảng các ngày làm việc, ví dụ [1,2,3,4,5] tương ứng với T2->T6
        const daysOfWeek = [
            { day: 'T2', value: 1 },
            { day: 'T3', value: 2 },
            { day: 'T4', value: 3 },
            { day: 'T5', value: 4 },
            { day: 'T6', value: 5 },
            { day: 'T7', value: 6 },
            { day: 'CN', value: 0 }
        ];

        return (
            <Space size={[0, 4]} wrap>
                {daysOfWeek.map((item) => (
                    <Tag 
                        key={item.value}
                        color={workingDays.includes(item.value) ? 'processing' : 'error'}
                        style={{ 
                            margin: '2px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: workingDays.includes(item.value) ? 'bold' : 'normal'
                        }}
                    >
                        {item.day}
                    </Tag>
                ))}
                <Tag 
                    color="success" 
                    style={{ 
                        marginLeft: '8px',
                        padding: '4px 8px',
                        borderRadius: '12px'
                    }}
                >
                    {workingDays.length} ngày/tuần
                </Tag>
            </Space>
        );
    };

    const attendanceColumns = [
        { title: 'Thời gian bắt đầu chấm công vào', dataIndex: ['value', 'checkin_time'], key: 'workStartTime' },
        { title: 'Thời gian có thể vào muộn', dataIndex: ['value', 'late_allowance_minutes'], key: 'workLateTime' },
        { title: 'Thời gian chấm công ra', dataIndex: ['value', 'checkout_time'], key: 'workEndTime' },
        { title: 'Thời gian có thể về sớm', dataIndex: ['value', 'early_leave_allowance_minutes'], key: 'workEarlyTime' },
        {
            title: 'Thời gian nghỉ trưa bắt đầu',
            key: 'lunchStartTime',
            render: (_, record) => record.value?.break_times?.[0]?.start || '—'
        },
        {
            title: 'Thời gian nghỉ trưa kết thúc',
            key: 'lunchEndTime',
            render: (_, record) => record.value?.break_times?.[0]?.end || '—'
        },
        { 
            title: 'Ngày làm việc trong tuần', 
            dataIndex: ['value', 'working_days'], 
            key: 'WorkingTimes',
            render: (workingDays) => renderWorkingDays(workingDays || [])
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button 
                    type="primary" 
                    icon={<EditOutlined/>}
                    onClick={() => showModal('attendance')}
                >
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const leaveColumns = [
        {title: 'Số ngày nghỉ phép năm', dataIndex: 'annualLeave', key: 'annualLeave'},
        {title: 'Số ngày nghỉ ốm', dataIndex: 'sickLeave', key: 'sickLeave'},
        {title: 'Số ngày nghỉ việc riêng', dataIndex: 'personalLeave', key: 'personalLeave'},
        {title: 'Số ngày nghỉ thai sản', dataIndex: 'maternityLeave', key: 'maternityLeave'},
        {title: 'Số ngày nghỉ cho nam giới khi vợ sinh', dataIndex: 'paternityLeave', key: 'paternityLeave'},
        {title: 'Số ngày phép được chuyển sang năm sau', dataIndex: 'carryOverDays', key: 'carryOverDays'},
        {title: 'Hệ số lương ngày lễ', dataIndex: 'holidayWorkMultiplier', key: 'holidayWorkMultiplier'},
        {title: 'Hệ số lương ngày cuối tuần', dataIndex: 'weekendWorkMultiplier', key: 'weekendWorkMultiplier'},
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button 
                    type="primary" 
                    icon={<EditOutlined/>}
                    onClick={() => showModal('leave')}
                >
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const salaryColumns = [
        {
            title: 'Số ngày công tiêu chuẩn/tháng',
            dataIndex: 'workingDaysPerMonth',
            key: 'workingDaysPerMonth',
            render: (value) => `${value} ngày`
        },
        {
            title: 'Mức phạt đi muộn',
            dataIndex: 'latePenalty',
            key: 'latePenalty',
            render: (value) => `${value.toLocaleString()} VNĐ/phút`
        },
        {
            title: 'Hệ số làm thêm ngày thường',
            dataIndex: 'overtimeNormal',
            key: 'overtimeNormal',
            render: (value) => `${value}%`
        },
        {
            title: 'Hệ số làm thêm cuối tuần',
            dataIndex: 'overtimeWeekend',
            key: 'overtimeWeekend',
            render: (value) => `${value}%`
        },
        {
            title: 'Hệ số làm thêm lễ, tết',
            dataIndex: 'overtimeHoliday',
            key: 'overtimeHoliday',
            render: (value) => `${value}%`
        },
        {
            title: 'Tổng tỷ lệ bảo hiểm',
            dataIndex: 'bhxhTotal',
            key: 'bhxhTotal',
            render: (value) => `${value}%`
        },
        {
            title: 'Chi tiết bảo hiểm',
            key: 'insuranceDetails',
            render: (_, record) => (
                <>
                    <div>BHXH: {record.bhxh}%</div>
                    <div>BHYT: {record.bhyt}%</div>
                    <div>BHTN: {record.bhtn}%</div>
                </>
            )
        },
        {
            title: 'Giảm trừ bản thân',
            dataIndex: 'personalDeduction',
            key: 'personalDeduction',
            render: (value) => `${value.toLocaleString()} VNĐ`
        },
        {
            title: 'Giảm trừ người phụ thuộc',
            dataIndex: 'dependentDeduction',
            key: 'dependentDeduction',
            render: (value) => `${value.toLocaleString()} VNĐ/người`
        },
        {
            title: 'Thuế suất TNCN',
            key: 'taxBrackets',
            render: (_, record) => (
                <div>
                    {record.taxBrackets.map((bracket, index) => (
                        <div key={index}>
                            {bracket.from.toLocaleString()} - {bracket.to ? bracket.to.toLocaleString() : '∞'}: {bracket.percent}%
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button 
                    type="primary" 
                    icon={<EditOutlined/>}
                    onClick={() => showModal('salary')}
                >
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const showModal = (type) => {
        setCurrentEditingType(type);
        setIsModalVisible(true);
        // Set initial form values based on type
        const initialValues = type === 'attendance' 
            ? attendanceData[0] 
            : type === 'leave'
                ? leaveData[0]
                : salaryData[0];
        form.setFieldsValue(initialValues);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(values => {
                console.log('Success:', values);
                message.success('Cập nhật cài đặt thành công');
                setIsModalVisible(false);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const renderModalContent = () => {
        switch (currentEditingType) {
            case 'attendance':
                return (
                    <>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian bắt đầu làm việc"
                                    name="workStartTime"
                                    rules={[{required: true, message: 'Vui lòng chọn thời gian bắt đầu làm việc'}]}
                                >
                                    <TimePicker format="HH:mm" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian kết thúc làm việc"
                                    name="workEndTime"
                                    rules={[{required: true, message: 'Vui lòng chọn thời gian kết thúc làm việc'}]}
                                >
                                    <TimePicker format="HH:mm" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian bắt đầu nghỉ trưa"
                                    name="lunchStartTime"
                                    rules={[{required: true, message: 'Vui lòng chọn thời gian bắt đầu nghỉ trưa'}]}
                                >
                                    <TimePicker format="HH:mm" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian kết thúc nghỉ trưa"
                                    name="lunchEndTime"
                                    rules={[{required: true, message: 'Vui lòng chọn thời gian kết thúc nghỉ trưa'}]}
                                >
                                    <TimePicker format="HH:mm" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Thời gian cho phép đi muộn (phút)"
                                    name="gracePeriod"
                                    rules={[{required: true, message: 'Vui lòng nhập thời gian cho phép đi muộn'}]}
                                >
                                    <InputNumber min={0} max={60} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Tính làm thêm sau (giờ)"
                                    name="overtimeStartAfter"
                                    rules={[{required: true, message: 'Vui lòng nhập số giờ'}]}
                                >
                                    <InputNumber min={0} max={24} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Số ngày làm việc/tuần"
                                    name="workingDaysPerWeek"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày làm việc'}]}
                                >
                                    <InputNumber min={1} max={7} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tự động chấm công ra"
                                    name="autoCheckout"
                                    valuePropName="checked"
                                >
                                    <Switch/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian tự động chấm công ra"
                                    name="autoCheckoutTime"
                                    rules={[{required: true, message: 'Vui lòng chọn thời gian tự động chấm công ra'}]}
                                >
                                    <TimePicker format="HH:mm" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                );
            case 'leave':
                return (
                    <>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày nghỉ phép năm"
                                    name="annualLeave"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày nghỉ phép năm'}]}
                                >
                                    <InputNumber min={0} max={30} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày nghỉ ốm"
                                    name="sickLeave"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày nghỉ ốm'}]}
                                >
                                    <InputNumber min={0} max={60} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày nghỉ việc riêng"
                                    name="personalLeave"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày nghỉ việc riêng'}]}
                                >
                                    <InputNumber min={0} max={10} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày nghỉ thai sản"
                                    name="maternityLeave"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày nghỉ thai sản'}]}
                                >
                                    <InputNumber min={0} max={180} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày nghỉ cho nam giới khi vợ sinh"
                                    name="paternityLeave"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày nghỉ cho nam giới'}]}
                                >
                                    <InputNumber min={0} max={30} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số ngày phép được chuyển sang năm sau"
                                    name="carryOverDays"
                                    rules={[{required: true, message: 'Vui lòng nhập số ngày được chuyển'}]}
                                >
                                    <InputNumber min={0} max={15} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Hệ số lương ngày lễ"
                                    name="holidayWorkMultiplier"
                                    rules={[{required: true, message: 'Vui lòng nhập hệ số lương ngày lễ'}]}
                                >
                                    <InputNumber min={1} max={5} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Hệ số lương ngày cuối tuần"
                                    name="weekendWorkMultiplier"
                                    rules={[{required: true, message: 'Vui lòng nhập hệ số lương ngày cuối tuần'}]}
                                >
                                    <InputNumber min={1} max={5} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                );
            case 'salary':
                return (
                    <>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Phương thức tính lương cơ bản"
                                    name="basicSalaryCalculation"
                                    rules={[{required: true, message: 'Vui lòng chọn phương thức tính lương'}]}
                                >
                                    <Radio.Group>
                                        <Radio value="monthly">Cố định theo tháng</Radio>
                                        <Radio value="hourly">Theo giờ</Radio>
                                        <Radio value="daily">Theo ngày</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Phương thức tính thưởng"
                                    name="bonusCalculation"
                                    rules={[{required: true, message: 'Vui lòng chọn phương thức tính thưởng'}]}
                                >
                                    <Radio.Group>
                                        <Radio value="performance">Theo hiệu suất</Radio>
                                        <Radio value="fixed">Số tiền cố định</Radio>
                                        <Radio value="percentage">Phần trăm lương</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Overtime Rate"
                                    name="overtimeRate"
                                    rules={[{required: true, message: 'Please enter overtime rate'}]}
                                >
                                    <InputNumber min={1} max={5} step={0.1} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Night Shift Rate"
                                    name="nightShiftRate"
                                    rules={[{required: true, message: 'Please enter night shift rate'}]}
                                >
                                    <InputNumber min={1} max={5} step={0.1} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Holiday Rate"
                                    name="holidayRate"
                                    rules={[{required: true, message: 'Please enter holiday rate'}]}
                                >
                                    <InputNumber min={1} max={5} step={0.1} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Weekend Rate"
                                    name="weekendRate"
                                    rules={[{required: true, message: 'Please enter weekend rate'}]}
                                >
                                    <InputNumber min={1} max={5} step={0.1} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tax Rate (%)"
                                    name="taxRate"
                                    rules={[{required: true, message: 'Please enter tax rate'}]}
                                >
                                    <InputNumber min={0} max={100} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Insurance Rate (%)"
                                    name="insuranceRate"
                                    rules={[{required: true, message: 'Please enter insurance rate'}]}
                                >
                                    <InputNumber min={0} max={100} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Late Deduction (VND)"
                                    name="lateDeduction"
                                    rules={[{required: true, message: 'Please enter late deduction amount'}]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        style={{width: '100%'}}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Early Leave Deduction (VND)"
                                    name="earlyLeaveDeduction"
                                    rules={[{required: true, message: 'Please enter early leave deduction amount'}]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        style={{width: '100%'}}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '15px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>
                    <SettingOutlined style={{marginRight: '8px'}}/>
                    Cài đặt hệ thống
                </Title>
                <Text type="secondary">
                    Cấu hình các thiết lập cho chấm công, ngày nghỉ và tính lương
                </Text>
            </div>

            <Card 
                style={{
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                }}
            >
                <Tabs 
                    activeKey={activeTab} 
                    onChange={onChangeTab}
                    style={{ padding: '8px' }}
                >
                    <TabPane
                        tab={
                            <span>
                                <ClockCircleOutlined style={{ marginRight: '8px' }}/>
                                Cài đặt chấm công
                            </span>
                        }
                        key={STATUS.WORKING_TIME_SETTINGS}
                    >
                        <div style={{ padding: '16px 0' }}>
                            <Table
                                columns={attendanceColumns}
                                dataSource={attendanceData}
                                pagination={false}
                                scroll={{x: true}}
                                style={{ 
                                    backgroundColor: '#fff',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <CalendarOutlined style={{ marginRight: '8px' }}/>
                                Cài đặt ngày nghỉ
                            </span>
                        }
                        key="leave"
                    >
                        <div style={{ padding: '16px 0' }}>
                            <Table
                                columns={leaveColumns}
                                dataSource={leaveData}
                                pagination={false}
                                scroll={{x: true}}
                                style={{ 
                                    backgroundColor: '#fff',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <DollarOutlined style={{ marginRight: '8px' }}/>
                                Cài đặt tính lương
                            </span>
                        }
                        key={STATUS.SALARY_SETTINGS}
                    >
                        <div style={{ padding: '16px 0' }}>
                            <Table
                                columns={salaryColumns}
                                dataSource={salaryData}
                                pagination={false}
                                scroll={{x: true}}
                                style={{ 
                                    backgroundColor: '#fff',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title={`Chỉnh sửa ${currentEditingType === 'attendance' ? 'chấm công' : 
                                  currentEditingType === 'leave' ? 'ngày nghỉ' : 
                                  'tính lương'}`}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={1000}
                bodyStyle={{ padding: '24px' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    {renderModalContent()}
                </Form>
            </Modal>

            <Alert
                message="Lưu ý quan trọng"
                description="Những thay đổi về cài đặt sẽ ảnh hưởng đến việc tính lương và số ngày nghỉ phép. Vui lòng xem xét kỹ trước khi lưu."
                type="info"
                showIcon
                style={{
                    marginTop: '24px',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
};

export default AdminSettings;
