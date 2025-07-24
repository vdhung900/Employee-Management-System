import React, {useEffect, useState} from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Button,
    Table,
    Input,
    Space,
    Tag,
    Dropdown,
    Modal,
    Form,
    Select,
    DatePicker,
    Upload,
    Tabs,
    Avatar,
    Divider,
    Tooltip,
    Badge,
    Statistic,
    Progress,
    Alert,
    Drawer,
    Timeline,
    List,
    Radio, message, TimePicker, InputNumber
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    FilterOutlined,
    ExportOutlined,
    EyeOutlined,
    UploadOutlined,
    DownOutlined,
    FileTextOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    PrinterOutlined,
    MailOutlined,
    BellOutlined,
    HistoryOutlined,
    CloseOutlined,
    QuestionCircleOutlined,
    CalendarOutlined,
    PhoneOutlined,
    TagOutlined,
    RiseOutlined,
    DollarOutlined,
    StarOutlined, FilePdfOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import CategoryService from "../../services/CategoryService";
import requestService from "../../services/RequestService";
import admin_account from "../../services/Admin_account";
import {formatDate, formatNumber} from "../../utils/format";
import moment from 'moment';
import UploadFileComponent from "../../components/file-list/FileList";
import {STATUS} from "../../constants/Status";
import Hr_ManageEmployee from "../../services/Hr_ManageEmployee";
import SalaryService from "../../services/SalaryService";
import '../../assets/styles/salaryTableCustom.css';
import {useLoading} from "../../contexts/LoadingContext";
import { renderRequestDetailByType } from '../../utils/render';
// Thêm import cho xuất file
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from "dayjs";
import SignatureCanvas from 'react-signature-canvas';
import StatisticCard from "../../components/card/StatisticCard";
import RequestService from "../../services/RequestService";
import FileService from "../../services/FileService";

const {Title, Text, Paragraph} = Typography;
const {Option} = Select;
const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

const LEAVE_TYPES = [
    STATUS.LEAVE_REQUEST,
    STATUS.MARRIAGE_LEAVE,
    STATUS.MATERNITY_LEAVE,
    STATUS.SICK_LEAVE,
    STATUS.UNPAID_LEAVE,
    STATUS.PATERNITY_LEAVE,
    STATUS.REMOTE_WORK,
    STATUS.FUNERAL_LEAVE,
];

const RequestTypeForm = ({form, requestType, departments = [], positions = [], employees = [], coefficients = []}) => {
    const formFields = {
        LEAVE_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày bắt đầu nghỉ"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => {
                                        return current && current < dayjs().startOf('day');
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'endDate']}
                                label="Ngày kết thúc nghỉ"
                                dependencies={[['dataReq', 'startDate']]}
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const startDate = getFieldValue(['dataReq', 'startDate']);
                                            if (!value || !startDate || value.valueOf() >= startDate.valueOf()) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
                                            );
                                        }
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => {
                                        return current && current < dayjs().startOf('day');
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do nghỉ phép"
                        rules={[{required: true, message: 'Vui lòng nhập lý do nghỉ phép'}]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập lý do nghỉ phép"/>
                    </Form.Item>
                </>
            ),
            initialValues: {
                dataReq: {
                    startDate: null,
                    endDate: null,
                    reason: ''
                }
            }
        },
        OVERTIME_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày tăng ca"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày tăng ca' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'hours']}
                                label="Thời gian làm thêm"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn thời gian!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value || value.length !== 2) {
                                                return Promise.reject(new Error('Vui lòng chọn thời gian!'));
                                            }
                                            const [startTime, endTime] = value;
                                            if (endTime.isAfter(startTime)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu!'));
                                        }
                                    }
                                ]}
                            >
                                <TimePicker.RangePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do tăng ca"
                        rules={[
                            { required: true, message: 'Vui lòng nhập lý do tăng ca' },
                            { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' }
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập lý do tăng ca"
                        />
                    </Form.Item>
                </>
            ),
            initialValues: {
                dataReq: {
                    startDate: null,
                    hours: null,
                    reason: ''
                }
            }
        },
        ACCOUNT_CREATE_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        {/* Họ và tên */}
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'fullName']}
                                label="Họ và tên nhân viên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên' },
                                    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                                    {
                                        pattern: /^[A-Za-zÀ-ỹ\s]+$/, // ✅ chỉ chữ & khoảng trắng
                                        message: 'Họ và tên chỉ được chứa chữ cái'
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên nhân viên" />
                            </Form.Item>
                        </Col>

                        {/* Ngày bắt đầu làm việc */}
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày bắt đầu làm việc"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) =>
                                        current && current < dayjs().startOf('day') // ✅ Không chọn ngày quá khứ
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        {/* Email */}
                        <Col span={8}>
                            <Form.Item
                                name={['dataReq', 'email']}
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>

                        {/* Số điện thoại */}
                        <Col span={8}>
                            <Form.Item
                                name={['dataReq', 'phone']}
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    {
                                        pattern: /^[0-9]{10,11}$/,
                                        message: 'Số điện thoại phải gồm 10-11 chữ số'
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={['dataReq', 'department']}
                                label="Phòng ban"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                            >
                                <Select
                                    placeholder="Chọn phòng ban"
                                    onChange={(value) => {
                                        const department = departments.find(dep => dep._id === value);
                                        const matched = positions.find(pos =>
                                            pos.name.toLowerCase().includes(department?.name.toLowerCase())
                                        );
                                        form.setFieldValue(['dataReq', 'position'], matched?._id);
                                    }}
                                >
                                    {departments.map(department => (
                                        <Option key={department._id} value={department._id}>
                                            {department.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        {/* Phòng ban */}


                        {/* Chức vụ */}
                        {/*<Col span={12}>*/}
                        {/*    <Form.Item*/}
                        {/*        name={['dataReq', 'position']}*/}
                        {/*        label="Chức vụ"*/}
                        {/*        rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}*/}
                        {/*    >*/}
                        {/*        <Select placeholder="Chọn chức vụ">*/}
                        {/*            {positions.map(position => (*/}
                        {/*                <Option key={position._id} value={position._id}>*/}
                        {/*                    {position.name}*/}
                        {/*                </Option>*/}
                        {/*            ))}*/}
                        {/*        </Select>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}

                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'reason']}
                                label="Chức vụ"
                                hidden={true}
                            />
                        </Col>
                    </Row>
                </>
            ),
            initialValues: {
                dataReq: {
                    fullName: '',
                    startDate: null,
                    email: '',
                    phone: '',
                    department: undefined,
                    position: undefined,
                    note: '',
                    reason: ''
                }
            }
        },
        TARGET_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'month']}
                                label="Tháng"
                                rules={[
                                    {required: true, message: 'Vui lòng chọn tháng'},
                                    {type: 'number', min: 1, max: 12, message: 'Tháng phải từ 1-12'}
                                ]}
                            >
                                <Select placeholder="Chọn tháng">
                                    {Array.from({length: 12}, (_, i) => (
                                        <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name={['dataReq', 'year']}
                                label="Năm"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập năm'},
                                    {type: 'number', min: 2000, message: 'Năm không hợp lệ'}
                                ]}
                            >
                                <InputNumber style={{width: '100%'}} placeholder="Nhập năm"/>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                name={['dataReq', 'reason']}
                                hidden={true}
                            >
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.List name={['dataReq', 'goals']} rules={[{required: true, message: 'Vui lòng nhập mục tiêu'}]}>
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Row key={key} gutter={16} style={{marginBottom: 8}}>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'title']}
                                                rules={[{required: true, message: 'Vui lòng nhập tiêu đề mục tiêu'}]}
                                            >
                                                <Input placeholder="Tiêu đề mục tiêu"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'targetValue']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập mức độ hoàn thành mục tiêu (tối đa 100)'
                                                    },
                                                    {
                                                        type: 'number',
                                                        max: 100,
                                                        min: 0,
                                                        message: 'Mức độ hoàn thành tối đa là 100'
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    style={{width: '100%'}}
                                                    placeholder="Mức độ hoàn thành mục tiêu (tối đa 100)"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="text" danger onClick={() => remove(name)}>
                                                <DeleteOutlined/>
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Thêm mục tiêu
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </>
            ),
            initialValues: {
                dataReq: {
                    month: undefined,
                    year: new Date().getFullYear(),
                    reason: '',
                    goals: []
                }
            }
        },
        SALARY_INCREASE: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'employeeId']}
                                label="Nhân viên"
                                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                            >
                                <Select
                                    placeholder="Chọn nhân viên"
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                        const selectedEmployee = employees.find(emp => emp?._id === value);

                                        if (selectedEmployee) {
                                            const currentCoef = selectedEmployee.salaryCoefficientId;
                                            const currentSalary =
                                                currentCoef?.salary_coefficient *
                                                currentCoef?.salary_rankId?.salary_base;

                                            const availableCoefficients = coefficients.filter(
                                                coef => coef.rank > (currentCoef?.rank || 0)
                                            );

                                            form.setFieldsValue({
                                                dataReq: {
                                                    ...form.getFieldValue('dataReq'),
                                                    department: selectedEmployee.departmentId?.name || '',
                                                    currentCoefficient: currentCoef?.salary_coefficient || 0,
                                                    currentSalary: formatNumber(currentSalary || 0),
                                                    employeeSalaryIncreaseId: selectedEmployee._id,
                                                    currentRank: currentCoef?.rank || 0, // ✅ Lưu bậc hiện tại
                                                    proposedCoefficient: undefined,
                                                    proposedSalary: undefined,
                                                    salaryCoefficientsId: undefined,
                                                },
                                            });

                                            if (availableCoefficients.length === 0) {
                                                message.warning(
                                                    'Nhân viên này đã đạt mức lương tối đa, không còn bậc để tăng!'
                                                );
                                            }
                                        }
                                    }}
                                >
                                    {employees.map((employee) => (
                                        <Option key={employee._id} value={employee._id}>
                                            {employee.fullName} - {employee.email}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name={['dataReq', 'department']} label="Bộ phận">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'currentCoefficient']}
                                label="Hệ số lương hiện tại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập hệ số lương hiện tại' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%', color: 'blue', fontWeight: 'bold' }}
                                    disabled
                                    precision={2}
                                    step={0.01}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'currentSalary']}
                                label="Số lương hiện tại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lương hiện tại' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%', color: 'blue', fontWeight: 'bold' }}
                                    precision={2}
                                    step={0.01}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item shouldUpdate={(prev, cur) =>
                        prev.dataReq?.currentRank !== cur.dataReq?.currentRank
                    }>
                        {() => {
                            const currentRank = form.getFieldValue(['dataReq', 'currentRank']) || 0;
                            const availableCoefficients = coefficients.filter(coef => coef.rank > currentRank);

                            return (
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['dataReq', 'proposedCoefficient']}
                                            label="Hệ số lương đề xuất"
                                            rules={[
                                                { required: true, message: 'Vui lòng chọn hệ số lương đề xuất' },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Chọn hệ số lương đề xuất"
                                                onChange={(value) => {
                                                    const selectedCoefficient = coefficients.find(
                                                        coef => coef._id === value
                                                    );
                                                    if (selectedCoefficient) {
                                                        const proposedSalary =
                                                            selectedCoefficient.salary_coefficient *
                                                            selectedCoefficient.salary_rankId?.salary_base;
                                                        form.setFieldsValue({
                                                            dataReq: {
                                                                ...form.getFieldValue('dataReq'),
                                                                proposedCoefficient:
                                                                selectedCoefficient.salary_coefficient,
                                                                proposedSalary: formatNumber(proposedSalary),
                                                                salaryCoefficientsId: selectedCoefficient._id,
                                                            },
                                                        });
                                                    }
                                                }}
                                            >
                                                {availableCoefficients.map(coef => (
                                                    <Option key={coef._id} value={coef._id}>
                                                        {coef.salary_coefficient} (Bậc {coef.rank})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name={['dataReq', 'proposedSalary']}
                                            label="Số lương đề xuất"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn hệ số lương đề xuất',
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                style={{ width: '100%', color: 'blue', fontWeight: 'bold' }}
                                                precision={2}
                                                step={0.01}
                                                disabled
                                            />
                                        </Form.Item>
                                        {/* Ẩn để lưu ID hệ số lương */}
                                        <Form.Item name={['dataReq', 'salaryCoefficientsId']} hidden />
                                    </Col>
                                </Row>
                            );
                        }}
                    </Form.Item>
                    {/*<Row gutter={16}>*/}
                    {/*    <Col span={24}>*/}
                    {/*        <Form.Item*/}
                    {/*            name={['dataReq', 'effectiveDate']}*/}
                    {/*            label="Ngày hiệu lực"*/}
                    {/*        >*/}
                    {/*            <DatePicker*/}
                    {/*                style={{width: '100%'}}*/}
                    {/*                format="DD/MM/YYYY"*/}
                    {/*                placeholder="Chọn ngày hiệu lực"*/}
                    {/*                disabled*/}
                    {/*            />*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do đề xuất"
                        rules={[
                            {required: true, message: 'Vui lòng nhập lý do đề xuất'},
                            {min: 10, message: 'Lý do phải có ít nhất 10 ký tự'}
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập lý do đề xuất tăng lương (thành tích, đóng góp, kỹ năng mới,...)"
                        />
                    </Form.Item>
                </>
            ),
            initialValues: {
                dataReq: {
                    employeeId: undefined,
                    department: '',
                    currentCoefficient: undefined,
                    currentSalary: undefined,
                    proposedCoefficient: undefined,
                    proposedSalary: undefined,
                    currentRank: undefined,
                    salaryCoefficientsId: undefined,
                    effectiveDate: undefined,
                    reason: '',
                    attachments: []
                }
            }
        }
    };

    const selectedType = LEAVE_TYPES.includes(requestType) ? 'LEAVE_REQUEST' : requestType;
    const selectedForm = formFields[selectedType];
    if (!selectedForm) return null;

    if (requestType === 'MATERNITY_LEAVE') {
        return (
            <>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={['dataReq', 'startDate']}
                            label="Ngày bắt đầu nghỉ"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                            ]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                onChange={(date) => {
                                    if (date) {
                                        const endDate = date.clone().add(180, 'days');
                                        form.setFieldsValue({
                                            dataReq: {
                                                ...form.getFieldValue('dataReq'),
                                                startDate: date,
                                                endDate: endDate,
                                            },
                                        });
                                    } else {
                                        form.setFieldsValue({
                                            dataReq: {
                                                ...form.getFieldValue('dataReq'),
                                                startDate: null,
                                                endDate: null,
                                            },
                                        });
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={['dataReq', 'endDate']}
                            label="Ngày kết thúc nghỉ"
                            dependencies={[['dataReq', 'startDate']]}
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue(['dataReq', 'startDate']);
                                        if (!value || !startDate || value.valueOf() >= startDate.valueOf()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Ngày kết thúc không được trước ngày bắt đầu')
                                        );
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name={['dataReq', 'reason']}
                    label="Lý do nghỉ phép"
                    rules={[
                        { required: true, message: 'Vui lòng nhập lý do nghỉ phép' },
                        { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' },
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập lý do nghỉ phép" />
                </Form.Item>
            </>
        );
    }

    return selectedForm.fields;
};

const Requests = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestCategories, setRequestCategories] = useState([]);
    const [selectedDataType, setSelectedDataType] = useState(null);
    const [selectedRequestType, setSelectedRequestType] = useState(null);
    const [form] = Form.useForm();
    const [requests, setRequests] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [coefficients, setCoefficients] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [fileResponse, setFileResponse] = useState([]);
    const [salarySlips, setSalarySlips] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedRows, setEditedRows] = useState({});
    const {showLoading, hideLoading} = useLoading();
    const [salarySlipPreview, setSalarySlipPreview] = useState(null); // base64 PDF
    const [showSignModal, setShowSignModal] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signType, setSignType] = useState('draw'); // 'draw' | 'image'
    const [signaturePad, setSignaturePad] = useState(null);
    const [signatureImage, setSignatureImage] = useState(null); // base64 ảnh upload
    const [signedPdf, setSignedPdf] = useState(null); // base64 PDF đã ký
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [salarySlipHash, setSalarySlipHash] = useState(null);
    const [disabledFile, setDisabledFile] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [originalData, setOriginalData] = useState([]);
    const [salaryEmpty, setSalaryEmpty] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        try {
            showLoading()
            loadTypeReq();
            loadDataReq();
            loadEmployees();
        } catch (e) {
            console.log(e, 'test');
        }finally {
            hideLoading()
        }
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await admin_account.getAllDepartments();
            if (response.success) {
                setDepartments(response.data);
            }
        } catch (e) {
            console.log(e, 'test');
        }
    }

    const loadPositions = async () => {
        try {
            const response = await admin_account.getAllPositions();
            if (response.success) {
                setPositions(response.data);
            }
        } catch (e) {
            console.log(e, 'test');

        }
    }

    const loadDataReq = async (status?) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("Bạn chưa đăng nhập !!!");
            let body = {
                employeeId: user.employeeId,
                status: status
            }
            const response = await requestService.getByAccountId(body);
            if (response.success) {
                if(!status){
                    console.log('run')
                    console.log(status)
                    setOriginalData(response.data)
                }
                setRequests(response.data);
            }
        } catch (e) {
            console.log(e, 'Error loading data requests');
        }
    }

    const loadTypeReq = async () => {
        try {
            const response = await CategoryService.getTypeReqByRole();
            if (response.success) {
                const data = response.data;
                data.map(item => ({
                    code: item.code,
                    name: item.name
                }))
                setRequestCategories(data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const loadSalarySlip = async () => {
        try {
            const date = new Date();
            const responseSal = await SalaryService.getSalaryCaculatedByMonth(date);
            console.log(responseSal.success);
            if (responseSal.success) {
                const data = responseSal.data;
                if(data.length > 0){
                  setSalarySlips(data || []);
                }else{
                  calculateSalary();
                }
            } else {
                message.error("Lỗi khi lấy phiếu lương!");
            }
        } catch (e) {
            message.error('Error loading salary slip');
        }
    };

    const calculateSalary = async () => {
        try {
            const responseCal = await SalaryService.caculateSalary();
            if (responseCal.success) {
              message.success("Tính lương thành công, vui lòng tải lại trang để xem kết quả!");
            }
        } catch (e) {
            message.error('Error calculating salary');
        }
    }

    const loadEmployees = async () => {
        try {
            const response = await Hr_ManageEmployee.getEmployeeSalary();
            if (response.success) {
                setEmployees(response.data);
            }
        } catch (e) {
            message.error('Error loading employees');
        }
    }

    const loadCoefficient = async () => {
        try {
            const response = await Hr_ManageEmployee.getAllCoefficients();
            if (response.success) {
                let data = response.data;
                data.sort((a, b) => a.rank - b.rank);
                console.log(data)
                setCoefficients(data);
            }
        } catch (e) {
            message.error('Error loading coefficient');
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'processing';
            case 'cancelled':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Approved':
                return 'Đã phê duyệt';
            case 'Rejected':
                return 'Từ chối';
            case 'Pending':
                return 'Đang chờ duyệt';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'normal':
                return 'blue';
            case 'low':
                return 'green';
            default:
                return 'default';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high':
                return 'Cao';
            case 'normal':
                return 'Bình thường';
            case 'low':
                return 'Thấp';
            default:
                return 'Không xác định';
        }
    };

    const showModal = (request = null) => {
        setSelectedRequest(request);
        setIsModalVisible(true);
        setIsEdit(false)
        if (request) {
            setIsEdit(true);
            handleRequestTypeChange(request.typeRequest.code);
            form.setFieldsValue({
                requestId: request._id,
                employeeId: request.employeeId,
                departmentId: request.departmentId,
                typeCode: request.typeRequest.code,
                month: request.month ? moment(request.month) : null,
                priority: request.priority,
                note: request.note,
                attachments: request.attachments
            });
            setFileResponse(request.attachments)
            if (request.typeRequest.code === STATUS.ACCOUNT_CREATE_REQUEST) {
                form.setFieldsValue({
                    dataReq: {
                        fullName: request.dataReq.fullName || '',
                        startDate: request.dataReq.startDate ? moment(request.dataReq.startDate) : undefined,
                        email: request.dataReq.email || '',
                        phone: request.dataReq.phone || '',
                        department: request.dataReq.department || '',
                        // position: request.dataReq.position || '',
                        note: request.dataReq.note || '',
                        reason: request.dataReq.reason || ''
                    }
                })
            } else if (request.typeRequest.code === STATUS.LEAVE_REQUEST) {
                form.setFieldsValue({
                    dataReq: {
                        startDate: request.dataReq.startDate ? moment(request.dataReq.startDate) : undefined,
                        endDate: request.dataReq.endDate ? moment(request.dataReq.endDate) : undefined,
                        reason: request.dataReq.reason || ''
                    }
                })
            } else if (request.typeRequest.code === STATUS.OVERTIME_REQUEST) {
                let hoursValue;
                if (request.dataReq.hours && Array.isArray(request.dataReq.hours)) {
                    try {
                        hoursValue = [
                            moment(request.dataReq.hours[0], 'HH:mm'),
                            moment(request.dataReq.hours[1], 'HH:mm')
                        ];
                    } catch (error) {
                        hoursValue = undefined;
                    }
                }
                form.setFieldsValue({
                    dataReq: {
                        startDate: request.dataReq.startDate ? moment(request.dataReq.startDate) : undefined,
                        hours: hoursValue,
                        reason: request.dataReq.reason || ''
                    }
                })
            } else if (request.typeRequest.code === STATUS.TARGET_REQUEST) {
                form.setFieldsValue({
                    dataReq: {
                        month: request.dataReq.month || '',
                        year: request.dataReq.year || new Date().getFullYear(),
                        goals: request.dataReq.goals || [],
                        reason: request.dataReq.reason || ''
                    }
                })
            } else if (request.typeRequest.code === STATUS.SALARY_INCREASE) {
                form.setFieldsValue({
                    dataReq: {
                        employeeId: request.dataReq.employeeId || '',
                        currentSalary: request.dataReq.currentSalary || '',
                        proposedSalary: request.dataReq.proposedSalary || '',
                        currentCoefficient: request.dataReq.currentCoefficient || '',
                        proposedCoefficient: request.dataReq.proposedCoefficient || '',
                        effectiveDate: request.dataReq.effectiveDate ? moment(request.dataReq.effectiveDate) : undefined,
                        department: request.dataReq.department || '',
                        reason: request.dataReq.reason || ''
                    }
                })
            }
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRequestType(null);
        setFileResponse([])
        setIsEdit(false);
        setSalarySlipPreview(null);
        setDisabledFile(false);
        setSalaryEmpty(true);
    };

    const handleSignModalOk = async () => {
        if (!signaturePad || signaturePad.isEmpty()) {
            message.warning("Vui lòng ký vào ô ký số!");
            return;
        }
        const files = form.getFieldValue('attachments');
        if ((files && files.length > 0) || (fileResponse && fileResponse.length > 0)) {
            const file = files[0] || fileResponse[0];
            if (file.originalName?.startsWith('bang-luong-thang-ky')) {
                form.submit();
                setSigning(false)
                return;
            }
        }
        setSigning(true);
        try {
            const signatureDataUrl = signaturePad.getTrimmedCanvas().toDataURL("image/png");
            const signatureBase64 = signatureDataUrl.split(",")[1];
            const pdfHash = salarySlipHash;
            const payload = {
                month: selectedMonth,
                signatureImage: signatureBase64,
                originalHash: pdfHash,
            };
            const response = await SalaryService.signSalaryPdf(payload);
            if(response.success){
                const fileData = response.data.signFile;
                setFileResponse([fileData]);
                const currentValues = form.getFieldsValue(true);
                form.setFieldsValue({
                    ...currentValues,
                    attachments: fileData
                });

                setTimeout(() => {
                    form.submit();
                }, 0);
            }else{
                message.error(response.message);
            }

            setShowSignModal(false);
        } catch (e) {
            message.error(e.message);
        } finally {
            setSignaturePad(null)
            setSigning(false);
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            let body = values;
            if (body.typeCode === STATUS.OVERTIME_REQUEST && body.dataReq.hours) {
                body.dataReq.hours = body.dataReq.hours.map(time =>
                    time ? time.format('HH:mm') : null
                ).filter(time => time !== null);
            }
            if (fileResponse.length > 0) {
                body.attachments = fileResponse;
            } else {
                body.attachments = [];
            }
            if(body.typeCode === STATUS.SALARY_APPROVED) {
                if(!body.attachments && !body.attachments.length > 0) {
                    message.error("Không thể gửi và ký khi không có bảng lương!")
                    return;
                }
            }
            if (body.requestId) {
                const response = await requestService.updateRequest(body);
                if (response.success) {
                    message.success(response.message);
                }
            } else {
                const user = JSON.parse(localStorage.getItem("user"));
                const employee = JSON.parse(localStorage.getItem("employee"));
                body.employeeId = user.employeeId;
                body.departmentId = employee.departmentId._id;
                const response = await requestService.createRequest(body);
                if (response.success) {
                    if(body.typeCode === STATUS.SALARY_APPROVED){
                        message.success("Ký và gửi duyệt thành công!");
                    }else{
                        message.success("Gửi duyệt thành công!");
                    }
                }
            }
        } catch (e) {
            message.error("Lỗi khi lưu thông tin")
        } finally {
            loadDataReq();
            setIsModalVisible(false);
            setFileResponse([])
            form.resetFields();
            setSelectedDataType(null);
            setSalarySlipPreview(null);
            setSelectedMonth(null)
            setDisabledFile(false);
        }
    };

    const handleRequestTypeChange = (value) => {
        setSelectedRequestType(value);
        if (value === STATUS.ACCOUNT_CREATE_REQUEST) {
            loadPositions();
            loadDepartments();
        } else if (value === STATUS.SALARY_INCREASE) {
            loadEmployees();
            loadCoefficient();
        }else if(value === STATUS.SALARY_APPROVED){
            setDisabledFile(true)
        }
        const formFields = {
            LEAVE_REQUEST: {
                dataReq: {
                    startDate: undefined,
                    endDate: undefined,
                    reason: undefined
                }
            },
            OVERTIME: {
                dataReq: {
                    startDate: undefined,
                    hours: undefined,
                    reason: undefined
                }
            },
            ACCOUNT_CREATE_REQUEST: {
                dataReq: {
                    fullName: undefined,
                    startDate: undefined,
                    email: undefined,
                    phone: undefined,
                    department: undefined,
                    position: undefined,
                    reason: undefined
                }
            },
            TARGET_REQUEST: {
                dataReq: {
                    month: undefined,
                    year: new Date().getFullYear(),
                    goals: []
                }
            },
            SALARY_INCREASE: {
                dataReq: {
                    employeeId: undefined,
                    currentSalary: undefined,
                    proposedSalary: undefined,
                    effectiveDate: undefined,
                    department: undefined,
                    reason: undefined
                }
            }
        };
        form.setFieldsValue(formFields[value] || {});
    };

    const renderRequestTypeFields = () => {
        return <RequestTypeForm form={form} requestType={selectedRequestType} departments={departments}
                                positions={positions} employees={employees} coefficients={coefficients}/>;
    };

    const showDrawer = (request) => {
        setSelectedRequest(request);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const checkFileValid = () => {
        const files = form.getFieldValue('attachments');
        if ((files && files.length > 0) || (fileResponse && fileResponse.length > 0)) {
            const file = files[0] || fileResponse[0];
            if (file.originalName?.startsWith('bang-luong-thang-ky')) {
                form.submit();
                setSigning(false)
                return;
            }
        }else if(salaryEmpty) {
            message.error("Không thể gửi và ký khi không có bảng lương!")
            return;
        } else {
            setShowSignModal(true);
        }
    }

    const checkByMonth = async (month) => {
        try{
            const response = await RequestService.checkByMonth(month);
            if(response.success){
                if(response.data !== null || response.data){
                    return false;
                }else{
                    return true;
                }
            }else {
                return false;
            }
        }catch (e) {
            message.error(e.message);
        }
    }

    const handleChangeMonth = async (date) => {
        try{
            showLoading()
            setSalaryEmpty(false);
            if (date) {
                const selectedMonth = date.format("YYYY-MM");
                const checkDataValid = await checkByMonth(selectedMonth);
                if(!checkDataValid){
                    message.error("Bảng lương của tháng này đã được phê duyệt, vui lòng thử lại với tháng khác!");
                    return;
                }
                setSelectedMonth(selectedMonth)
                const response = await SalaryService.getSalaryPreviewByMonth(selectedMonth)
                if(response.success){
                    const base64 = response.data?.pdfPreview;
                    setSalarySlipPreview(base64 || null);
                    setSalarySlipHash(response.data?.pdfHash)
                }else{
                    setSalarySlipPreview(null);
                    setDisabledFile(false);
                    setSalaryEmpty(true);
                    message.error(response.message);
                }
            } else {
                setSalarySlipPreview(null);
            }
        }catch (e) {
            setSalaryEmpty(true)
            setSalarySlipPreview(null);
            message.error(e.message);
        }finally {
            hideLoading()
        }
    };

    const handleStatusChange = (status) => {
        loadDataReq(status);
    };


    const confirmDelete = (request) => {
        Modal.confirm({
            title: 'Xác nhận hủy yêu cầu',
            content: `Bạn có chắc chắn muốn hủy yêu cầu ${request.typeRequest.name}?`,
            okText: 'Hủy yêu cầu',
            okType: 'danger',
            cancelText: 'Đóng',
            async onOk() {
                try {
                    let body = request;
                    body.requestId = request._id;
                    body.status = "Cancelled";
                    const response = await requestService.approveRequest(body);
                    if (response.success) {
                        loadDataReq();
                        Modal.success({
                            title: 'Yêu cầu đã được hủy',
                            content: `Yêu cầu ${request.typeRequest.name} đã được hủy thành công.`,
                        });
                    } else {
                        message.error(response.message);
                    }
                } catch (e) {
                    console.log(e)
                    message.error("Lỗi khi hủy yêu cầu");
                }
            },
        });
    };

    const handlePreviewDoc = async (doc) => {
        try {
            showLoading()
            console.log(doc)
            const key = encodeURIComponent(doc.key);
            const blob = await FileService.getFile(key);
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
        }finally {
            hideLoading()
        }
    };

    const columns = [
        {
            title: 'Người gửi yêu cầu',
            dataIndex: ['employeeId', 'fullName'],
            key: 'employeeName',
            render: (text, record) => (
                <Space>
                    <Avatar style={{backgroundColor: '#722ed1'}}>{text.charAt(0)}</Avatar>
                    <div>
                        <div style={{fontWeight: 'bold'}}>{text}</div>
                        <Text type="secondary">{record.employeeId.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Thông tin yêu cầu',
            key: 'requestInfo',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {/*<div style={{ fontWeight: 'bold' }}>{record.requestNumber}</div>*/}
                    <div>Loại: {record?.typeRequest?.name}</div>
                    <Tag color={getPriorityColor(record.priority)}>
                        {getPriorityLabel(record.priority)}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            key: 'duration',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div>Ngày gửi: {formatDate(record.createdAt)}</div>
                </Space>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        // {
        //     title: 'Thời gian giải quyết',
        //     dataIndex: 'timeResolve',
        //     key: 'timeResolve',
        // },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Lí do',
            key: 'reason',
            render: (value: any, record: any) => {
                if (record.status === STATUS.REJECTED) {
                    return record.reason || '—';
                } else {
                    return record.dataReq?.reason || '—';
                }
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Badge
                    status={
                        status === 'Approved' ? 'success' :
                            status === 'Rejected' ? 'error' :
                                status === 'Pending' ? 'processing' : 'default'
                    }
                    text={getStatusLabel(status)}
                />
            ),
            filters: [
                {text: 'Đã phê duyệt', value: 'Approved'},
                {text: 'Từ chối', value: 'Rejected'},
                {text: 'Đang chờ duyệt', value: 'Pending'},
                {text: 'Đã hủy', value: 'Cancelled'},
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {record?.typeRequest?.code === STATUS.SALARY_APPROVED ? (
                        <Tooltip title="Xem bảng lương PDF">
                            <Button
                                type="text"
                                icon={<FilePdfOutlined style={{ color: "#fa541c" }} />}
                                onClick={() => handlePreviewDoc(record.attachments[0])}
                            />
                        </Tooltip>
                        ) : (
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<EyeOutlined/>}
                                onClick={() => showDrawer(record)}
                            />
                        </Tooltip>
                    )}
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    type="text"
                                    icon={<EditOutlined/>}
                                    onClick={() => showModal(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Hủy yêu cầu">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined/>}
                                    onClick={() => confirmDelete(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const pendingRequests = originalData.filter(r => r.status === 'Pending').length;
    const approvedRequests = originalData.filter(r => r.status === 'Approved').length;
    const rejectedRequests = originalData.filter(r => r.status === 'Rejected').length;
    const cancelledRequests = originalData.filter(r => r.status === 'Cancelled').length;

    const exportExcel = (data) => {
        const exportData = data.map((item, idx) => ({
            'STT': idx + 1,
            'Người gửi': item.employeeId?.fullName || '',
            'Email': item.employeeId?.email || '',
            'Loại yêu cầu': item.typeRequest?.name || '',
            'Mức độ ưu tiên': getPriorityLabel(item.priority),
            'Ngày gửi': formatDate(item.createdAt),
            'Trạng thái': getStatusLabel(item.status),
            'Ghi chú': item.note || '',
            'Lí do': item.status === STATUS.REJECTED ? (item.reason || '—') : (item.dataReq?.reason || '—'),
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Requests');
        XLSX.writeFile(wb, 'requests.xlsx');
    };

    return (
        <div style={{padding: '24px'}}>
            <Row gutter={[16, 16]} style={{marginBottom: '20px'}}>
                <Col span={24}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <Title level={2}>
                                <FileTextOutlined style={{ marginRight: 8 }} />
                                Quản lý yêu cầu
                            </Title>
                            <Text type="secondary">Gửi và theo dõi các yêu cầu của nhân viên</Text>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => showModal()}
                                style={{marginRight: '8px'}}
                            >
                                Tạo yêu cầu mới
                            </Button>
                            {/* Thêm 2 nút xuất file */}
                            <Button
                                icon={<ExportOutlined/>}
                                style={{marginRight: 8}}
                                onClick={() => exportExcel(requests)}
                            >
                                Xuất Excel
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{marginBottom: '16px'}}>
                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <StatisticCard
                            title="Đang chờ duyệt"
                            value={pendingRequests}
                            total={originalData.length}
                            color="#1890ff"
                            prefix={<ClockCircleOutlined />}
                            onClick={() => handleStatusChange(STATUS.PENDING)}
                        />
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <StatisticCard
                            title="Đã phê duyệt"
                            value={approvedRequests}
                            total={originalData.length}
                            color="#52c41a"
                            prefix={<CheckCircleOutlined />}
                            onClick={() => handleStatusChange(STATUS.APPROVED)}
                        />
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <StatisticCard
                            title="Từ chối"
                            value={rejectedRequests}
                            total={originalData.length}
                            color="#ff4d4f"
                            prefix={<CloseCircleOutlined />}
                            onClick={() => handleStatusChange(STATUS.REJECTED)}
                        />
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <StatisticCard
                            title="Đã hủy"
                            value={cancelledRequests}
                            total={originalData.length}
                            color="#d9d9d9"
                            prefix={<CloseOutlined />}
                            onClick={() => handleStatusChange(STATUS.CANCELLED)}
                        />
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={<span><FileTextOutlined/> Tất cả yêu cầu</span>}
                        key="1"
                    >
                        <Card>
                            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                                <Input
                                    placeholder="Tìm kiếm theo tên, ID, số yêu cầu..."
                                    prefix={<SearchOutlined/>}
                                    style={{width: 300}}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </div>

                            <Table
                                dataSource={requests}
                                columns={columns}
                                rowKey="id"
                                pagination={{
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50', '100'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
                                }}
                            />
                        </Card>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>

            <Modal
                title={selectedRequest ? 'Chỉnh sửa yêu cầu' : 'Tạo yêu cầu mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    (selectedRequestType === STATUS.SALARY_APPROVED && !isEdit ? (
                        <Button
                            key="signsubmit"
                            type="primary"
                            onClick={() => checkFileValid()}
                        >
                            Gửi yêu cầu và ký
                        </Button>
                    ) : (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => form.submit()}
                        >
                            {selectedRequest ? 'Lưu thay đổi' : 'Gửi yêu cầu'}
                        </Button>
                    ))
                ]}
                width={1100}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="requestId"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="employeeId"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="departmentId"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="typeCode"
                        label="Loại yêu cầu"
                        rules={[{required: true, message: 'Vui lòng chọn loại yêu cầu'}]}
                    >
                        <Select
                            placeholder="Chọn loại yêu cầu"
                            onChange={handleRequestTypeChange}
                            disabled={isEdit}
                        >
                            {requestCategories.map(category => (
                                <Option key={category.code} value={category.code}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {selectedRequestType === STATUS.SALARY_APPROVED && (
                        <Form.Item
                            name="month"
                            label="Chọn tháng"
                            rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
                        >
                            <DatePicker
                                picker="month"
                                placeholder="Chọn tháng"
                                onChange={handleChangeMonth}
                                format={(value) => `Tháng ${value.format("M/YYYY")}`}
                                disabled={isEdit}
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="priority"
                        label="Mức độ ưu tiên"
                        rules={[{required: true, message: 'Vui lòng chọn mức độ ưu tiên'}]}
                    >
                        <Select placeholder="Chọn mức độ ưu tiên">
                            <Option value="high">Cao</Option>
                            <Option value="normal">Bình thường</Option>
                            <Option value="low">Thấp</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)"/>
                    </Form.Item>

                    <Form.Item
                        name="attachments"
                    >
                        <UploadFileComponent uploadFileSuccess={setFileResponse} isSingle={true} files={fileResponse} disableFile={disabledFile}/>
                    </Form.Item>
                    {selectedRequestType === STATUS.SALARY_APPROVED && salarySlipPreview && (
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontWeight: 'bold' }}>Preview bảng lương tháng đã chọn</label>
                            <iframe
                                src={`data:application/pdf;base64,${salarySlipPreview}`}
                                width="100%"
                                height="600px"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}
                    {selectedRequestType && (
                        <>
                            {renderRequestTypeFields()}
                        </>
                    )}
                </Form>
                <Modal
                    title="Ký bảng lương"
                    open={showSignModal}
                    onOk={handleSignModalOk}
                    onCancel={() => setShowSignModal(false)}
                    okText="Ký"
                    cancelText="Hủy"
                    confirmLoading={signing}
                >
                    <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}>
                        <SignatureCanvas
                            penColor="black"
                            canvasProps={{ width: 400, height: 120, className: 'sigCanvas' }}
                            ref={ref => setSignaturePad(ref)}
                            backgroundColor="#fff"
                        />
                        <div style={{ marginTop: 8 }}>
                            <Button onClick={() => signaturePad && signaturePad.clear()}>Xóa chữ ký</Button>
                        </div>
                    </div>
                    <p style={{ marginTop: 16 }}>Sau khi ký, chữ ký sẽ được gửi kèm với bảng lương PDF.</p>
                </Modal>
            </Modal>

            <Drawer
                title="Chi tiết yêu cầu"
                placement="right"
                width={700}
                onClose={closeDrawer}
                open={drawerVisible}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Đóng</Button>
                        {selectedRequest && selectedRequest.status === 'Pending' && (
                            <Button type="primary" onClick={() => showModal(selectedRequest)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Space>
                }
            >
                {selectedRequest && (
                    <>
                        <div style={{
                            marginBottom: 24,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <Title level={4} style={{marginBottom: 4}}>
                                    {selectedRequest.typeRequest.name}
                                </Title>
                                <Tag color={getStatusColor(selectedRequest.status)}>
                                    {getStatusLabel(selectedRequest.status)}
                                </Tag>
                                <Tag color={getPriorityColor(selectedRequest.priority)}>
                                    {getPriorityLabel(selectedRequest.priority)}
                                </Tag>
                            </div>
                            <div>
                                {/*<Space>*/}
                                {/*    <Button icon={<PrinterOutlined/>}>In yêu cầu</Button>*/}
                                {/*    <Button icon={<MailOutlined/>}>Gửi email</Button>*/}
                                {/*</Space>*/}
                            </div>
                        </div>

                        <Divider orientation="left">Thông tin nhân viên</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small">
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Avatar
                                            size={64}
                                            icon={<UserOutlined/>}
                                            style={{backgroundColor: '#722ed1', marginRight: 16}}
                                        />
                                        <div>
                                            <Title level={5}
                                                   style={{marginBottom: 4}}>{selectedRequest.employeeId.fullName}</Title>
                                            <div>Email: {selectedRequest.employeeId.email}</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Divider orientation="left">Thông tin yêu cầu</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Loại yêu cầu"
                                    value={selectedRequest.typeRequest.name}
                                    valueStyle={{fontSize: '16px'}}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Mức độ ưu tiên"
                                    value={getPriorityLabel(selectedRequest.priority)}
                                    valueStyle={{fontSize: '16px', color: getPriorityColor(selectedRequest.priority)}}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Ngày gửi"
                                    value={formatDate(selectedRequest.createdAt)}
                                    valueStyle={{fontSize: '16px'}}
                                />
                            </Col>
                        </Row>

                        {/* Hiển thị chi tiết dataReq theo loại yêu cầu */}
                        <Divider orientation="left">Chi tiết yêu cầu</Divider>
                        {renderRequestDetailByType(selectedRequest)}
                        <Divider orientation="left">Ghi chú</Divider>
                        <Paragraph>{selectedRequest.note}</Paragraph>

                        {/*<Divider orientation="left">*/}
                        {/*    <Space>*/}
                        {/*        <HistoryOutlined />*/}
                        {/*        Lịch sử yêu cầu*/}
                        {/*    </Space>*/}
                        {/*</Divider>*/}
                        {/*<Timeline mode="left">*/}
                        {/*    {selectedRequest.history.map((item, index) => (*/}
                        {/*        <Timeline.Item*/}
                        {/*            key={index}*/}
                        {/*            color={*/}
                        {/*                item.action.includes('Đã phê duyệt') ? 'green' :*/}
                        {/*                    item.action.includes('Từ chối') ? 'red' :*/}
                        {/*                        item.action.includes('Tạo yêu cầu') ? 'blue' :*/}
                        {/*                            item.action.includes('Đang xem xét') ? 'orange' : 'gray'*/}
                        {/*            }*/}
                        {/*            label={item.date}*/}
                        {/*        >*/}
                        {/*            <div style={{ fontWeight: 'bold' }}>{item.action}</div>*/}
                        {/*            <div>Thực hiện bởi: {item.user}</div>*/}
                        {/*        </Timeline.Item>*/}
                        {/*    ))}*/}
                        {/*</Timeline>*/}
                    </>
                )}
            </Drawer>
            <Modal
                open={previewVisible}
                title={`Xem trước: ${previewFile?.originalName}`}
                footer={null}
                onCancel={() => {
                    setPreviewVisible(false);
                    setPreviewUrl('');
                    setPreviewFile(null);
                }}
                width={1000}
            >
                {previewUrl && (
                    previewFile?.originalName?.toLowerCase().endsWith('.pdf') ? (
                        <iframe src={previewUrl} width="100%" height="700px" title="preview" />
                    ) : (
                        <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 600 }} />
                    )
                )}
            </Modal>
        </div>
    );
};

const salarySlipFieldsToShow = [
    'employeeId',
    'baseSalary',
    'salaryCoefficient',
    'totalBaseSalary',
    'benefit', // Thêm benefit
    'insurance',
    'familyDeduction',
    'personalIncomeTax',
    'latePenalty',
    'unpaidLeave',
    'otHoliday',
    'otWeekday',
    'otWeekend',
    'totalOtHour', // Thêm tổng giờ OT
    'totalOtSalary', // Thêm tổng lương OT
    'totalTaxableIncome', // Thêm tổng thu nhập chịu thuế
    'netSalary', // Thêm lương ròng
    'totalSalary',
];

const salarySlipColumnNameMap = {
    employeeId: 'Nhân viên',
    baseSalary: 'Lương cơ bản',
    salaryCoefficient: 'Hệ số lương',
    totalBaseSalary: 'Tổng lương cơ bản',
    benefit: 'Phụ cấp', // Thêm benefit
    insurance: 'Bảo hiểm',
    familyDeduction: 'Khấu trừ gia cảnh',
    personalIncomeTax: 'Thuế TNCN',
    latePenalty: 'Phạt đi muộn',
    unpaidLeave: 'Nghỉ không lương',
    otHoliday: 'OT ngày lễ',
    otWeekday: 'OT ngày thường',
    otWeekend: 'OT cuối tuần',
    totalOtHour: 'Tổng giờ OT', // Thêm tổng giờ OT
    totalOtSalary: 'Tổng lương OT', // Thêm tổng lương OT
    totalTaxableIncome: 'Tổng TN chịu thuế', // Thêm tổng thu nhập chịu thuế
    netSalary: 'Lương ròng', // Thêm lương ròng
    totalSalary: 'Lương thực nhận',
};

function getDynamicSalarySlipColumns(salarySlips) {
    if (!Array.isArray(salarySlips) || salarySlips.length === 0) return [];
    return [
        { title: 'STT', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
        ...salarySlipFieldsToShow.map(key => ({
            title: salarySlipColumnNameMap[key] || key,
            dataIndex: key,
            key,
            align: key === 'employeeId' ? 'left' : 'right',
            render: (value, record) => {
                if (key === 'employeeId') {
                    return record.employeeId?.fullName || '';
                }
                // Format tất cả các cột số (trừ employeeId)
                return typeof value === 'number' ? formatNumber(value) : value;
            }
        }))
    ];
}

export default Requests;
