import { useState } from 'react';
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
    Divider,
    TimePicker,
    InputNumber,
    Radio,
    Collapse,
    Space,
    message,
    Tag,
    Tooltip,
    Alert,
    Checkbox
} from 'antd';
import {
    SettingOutlined,
    SaveOutlined,
    ReloadOutlined,
    BellOutlined,
    MailOutlined,
    LockOutlined,
    ClockCircleOutlined,
    UserOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    CalendarOutlined,
    KeyOutlined,
    DatabaseOutlined,
    CloudUploadOutlined,
    ApiOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const AdminSettings = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('general');

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Settings saved successfully');
    };

    const handleReset = () => {
        form.resetFields();
        message.info('Settings reset to default values');
    };

    return (
        <div>
            <Title level={3}>
                <SettingOutlined style={{ marginRight: '8px' }} />
                System Settings
            </Title>
            <Text type="secondary">
                Configure the attendance system settings and preferences
            </Text>

            <Card style={{ marginTop: '16px' }}>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane
                        tab={
                            <span>
                <GlobalOutlined />
                General
              </span>
                        }
                        key="general"
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={{
                                system_name: 'Attendance Management System',
                                company_name: 'Your Company',
                                timezone: 'Asia/Ho_Chi_Minh',
                                date_format: 'DD/MM/YYYY',
                                time_format: '24h',
                                default_language: 'vi',
                                weekend_days: ['Saturday', 'Sunday'],
                                fiscal_year_start: 'January',
                            }}
                            onFinish={onFinish}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="System Name"
                                        name="system_name"
                                        rules={[{ required: true, message: 'Please enter the system name' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Company Name"
                                        name="company_name"
                                        rules={[{ required: true, message: 'Please enter the company name' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Time Zone"
                                        name="timezone"
                                        rules={[{ required: true, message: 'Please select the time zone' }]}
                                    >
                                        <Select>
                                            <Option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</Option>
                                            <Option value="Asia/Singapore">Singapore (GMT+8)</Option>
                                            <Option value="Asia/Tokyo">Japan (GMT+9)</Option>
                                            <Option value="Asia/Bangkok">Thailand (GMT+7)</Option>
                                            <Option value="UTC">UTC (GMT+0)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Default Language"
                                        name="default_language"
                                        rules={[{ required: true, message: 'Please select the default language' }]}
                                    >
                                        <Select>
                                            <Option value="vi">Vietnamese</Option>
                                            <Option value="en">English</Option>
                                            <Option value="ja">Japanese</Option>
                                            <Option value="zh">Chinese</Option>
                                            <Option value="ko">Korean</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Date Format"
                                        name="date_format"
                                        rules={[{ required: true, message: 'Please select the date format' }]}
                                    >
                                        <Select>
                                            <Option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</Option>
                                            <Option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</Option>
                                            <Option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</Option>
                                            <Option value="DD-MMM-YYYY">DD-MMM-YYYY (31-Dec-2023)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Time Format"
                                        name="time_format"
                                        rules={[{ required: true, message: 'Please select the time format' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="24h">24-hour (14:30)</Radio>
                                            <Radio value="12h">12-hour (2:30 PM)</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Weekend Days"
                                        name="weekend_days"
                                        rules={[{ required: true, message: 'Please select the weekend days' }]}
                                    >
                                        <Select mode="multiple">
                                            <Option value="Monday">Monday</Option>
                                            <Option value="Tuesday">Tuesday</Option>
                                            <Option value="Wednesday">Wednesday</Option>
                                            <Option value="Thursday">Thursday</Option>
                                            <Option value="Friday">Friday</Option>
                                            <Option value="Saturday">Saturday</Option>
                                            <Option value="Sunday">Sunday</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Fiscal Year Start"
                                        name="fiscal_year_start"
                                        rules={[{ required: true, message: 'Please select the fiscal year start month' }]}
                                    >
                                        <Select>
                                            <Option value="January">January</Option>
                                            <Option value="February">February</Option>
                                            <Option value="March">March</Option>
                                            <Option value="April">April</Option>
                                            <Option value="May">May</Option>
                                            <Option value="June">June</Option>
                                            <Option value="July">July</Option>
                                            <Option value="August">August</Option>
                                            <Option value="September">September</Option>
                                            <Option value="October">October</Option>
                                            <Option value="November">November</Option>
                                            <Option value="December">December</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                <ClockCircleOutlined />
                Attendance
              </span>
                        }
                        key="attendance"
                    >
                        <Form
                            layout="vertical"
                            initialValues={{
                                default_work_hours: 8,
                                work_week_days: 5,
                                auto_checkout: true,
                                auto_checkout_time: dayjs('00:00:00', 'HH:mm:ss'),
                                grace_period: 15,
                                late_checkin_threshold: 5,
                                early_checkout_threshold: 5,
                                overtime_threshold: 8,
                                track_breaks: true,
                                break_deduction: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Default Daily Work Hours"
                                        name="default_work_hours"
                                        rules={[{ required: true, message: 'Please enter default work hours' }]}
                                    >
                                        <InputNumber min={1} max={24} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Work Week (Days)"
                                        name="work_week_days"
                                        rules={[{ required: true, message: 'Please enter work week days' }]}
                                    >
                                        <InputNumber min={1} max={7} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Grace Period for Late Check-in (minutes)"
                                        name="grace_period"
                                        rules={[{ required: true, message: 'Please enter grace period' }]}
                                    >
                                        <InputNumber min={0} max={60} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Automatic Checkout"
                                        name="auto_checkout"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="Auto Checkout Time"
                                        name="auto_checkout_time"
                                        rules={[{ required: true, message: 'Please select auto checkout time' }]}
                                    >
                                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Track Breaks"
                                        name="track_breaks"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Deduct Breaks from Work Hours"
                                        name="break_deduction"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Thresholds for Alerts</Divider>

                            <Row gutter={24}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Late Check-in (minutes)"
                                        name="late_checkin_threshold"
                                        rules={[{ required: true, message: 'Please enter late check-in threshold' }]}
                                    >
                                        <InputNumber min={0} max={60} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Early Check-out (minutes)"
                                        name="early_checkout_threshold"
                                        rules={[{ required: true, message: 'Please enter early check-out threshold' }]}
                                    >
                                        <InputNumber min={0} max={60} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Overtime Threshold (hours)"
                                        name="overtime_threshold"
                                        rules={[{ required: true, message: 'Please enter overtime threshold' }]}
                                    >
                                        <InputNumber min={0} max={24} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                <EnvironmentOutlined />
                Locations
              </span>
                        }
                        key="locations"
                    >
                        <Form
                            layout="vertical"
                            initialValues={{
                                location_verification: ['gps', 'wifi'],
                                gps_accuracy: 100,
                                wifi_verification: true,
                                ip_verification: true,
                                remote_work_allowed: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Location Verification Methods"
                                        name="location_verification"
                                        rules={[{ required: true, message: 'Please select at least one verification method' }]}
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={8}>
                                                    <Checkbox value="gps">GPS</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="wifi">WiFi</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="ip">IP Address</Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Allow Remote Work"
                                        name="remote_work_allowed"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="GPS Accuracy Threshold (meters)"
                                        name="gps_accuracy"
                                        rules={[{ required: true, message: 'Please enter GPS accuracy threshold' }]}
                                    >
                                        <InputNumber min={10} max={1000} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="WiFi Verification"
                                        name="wifi_verification"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="IP Verification"
                                        name="ip_verification"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                <BellOutlined />
                Notifications
              </span>
                        }
                        key="notifications"
                    >
                        <Form
                            layout="vertical"
                            initialValues={{
                                enable_email_notifications: true,
                                enable_push_notifications: true,
                                enable_sms_notifications: false,
                                notify_late_checkin: true,
                                notify_missing_checkout: true,
                                notify_leave_approval: true,
                                notify_schedule_change: true,
                                email_frequency: 'immediate',
                                admin_daily_report: true,
                                admin_daily_report_time: dayjs('18:00:00', 'HH:mm:ss'),
                            }}
                            onFinish={onFinish}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Email Notifications"
                                        name="enable_email_notifications"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Push Notifications"
                                        name="enable_push_notifications"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="SMS Notifications"
                                        name="enable_sms_notifications"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Notification Events</Divider>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Late Check-in"
                                        name="notify_late_checkin"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="Missing Check-out"
                                        name="notify_missing_checkout"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Leave Approval/Rejection"
                                        name="notify_leave_approval"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="Schedule Changes"
                                        name="notify_schedule_change"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Admin Notifications</Divider>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Daily Summary Report"
                                        name="admin_daily_report"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Daily Report Time"
                                        name="admin_daily_report_time"
                                    >
                                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email Notification Frequency"
                                        name="email_frequency"
                                        rules={[{ required: true, message: 'Please select email frequency' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="immediate">Immediate</Radio>
                                            <Radio value="hourly">Hourly Digest</Radio>
                                            <Radio value="daily">Daily Digest</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                <LockOutlined />
                Security
              </span>
                        }
                        key="security"
                    >
                        <Form
                            layout="vertical"
                            initialValues={{
                                password_expiry_days: 90,
                                min_password_length: 8,
                                password_complexity: true,
                                max_login_attempts: 5,
                                session_timeout: 30,
                                require_2fa: false,
                                allowed_2fa_methods: ['app', 'email'],
                                data_retention_period: 36,
                            }}
                            onFinish={onFinish}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Password Expiry (days)"
                                        name="password_expiry_days"
                                        rules={[{ required: true, message: 'Please enter password expiry days' }]}
                                    >
                                        <InputNumber min={0} max={365} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Minimum Password Length"
                                        name="min_password_length"
                                        rules={[{ required: true, message: 'Please enter minimum password length' }]}
                                    >
                                        <InputNumber min={6} max={20} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Maximum Login Attempts"
                                        name="max_login_attempts"
                                        rules={[{ required: true, message: 'Please enter maximum login attempts' }]}
                                    >
                                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Session Timeout (minutes)"
                                        name="session_timeout"
                                        rules={[{ required: true, message: 'Please enter session timeout' }]}
                                    >
                                        <InputNumber min={5} max={240} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Require Strong Password"
                                        name="password_complexity"
                                        valuePropName="checked"
                                        tooltip="Passwords must contain uppercase, lowercase, numbers, and special characters"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Require Two-Factor Authentication"
                                        name="require_2fa"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Allowed 2FA Methods"
                                        name="allowed_2fa_methods"
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={8}>
                                                    <Checkbox value="app">Authenticator App</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="email">Email</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="sms">SMS</Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Data Retention Period (months)"
                                        name="data_retention_period"
                                        rules={[{ required: true, message: 'Please enter data retention period' }]}
                                    >
                                        <InputNumber min={1} max={60} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>

            <Alert
                message="Important Note"
                description="Some settings changes may require a system restart to take effect. Consider making changes during off-peak hours."
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default AdminSettings;
