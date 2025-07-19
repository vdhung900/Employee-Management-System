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
    StarOutlined
} from '@ant-design/icons';
import { STATUS } from "../constants/Status";
import { formatDate } from './format';

export function renderRequestDetailByType(request) {
    if (!request || !request.dataReq) return null;
    const {typeRequest, dataReq} = request;
    const labelStyle = {fontWeight: 'bold', marginRight: 8};
    const valueStyle = {marginBottom: 8};
    const {Text} = Typography;
    const iconStyle = {marginRight: 6, color: '#722ed1'};
    // Icon lớn đầu Card
    const cardIconStyle = {fontSize: 32, color: '#722ed1', marginBottom: 8};
    let cardIcon = null;
    switch (typeRequest.code) {
        case STATUS.FUNERAL_LEAVE:
        case STATUS.PATERNITY_LEAVE:
        case STATUS.LEAVE_REQUEST:
        case STATUS.MARRIAGE_LEAVE:
        case STATUS.MATERNITY_LEAVE:
        case STATUS.SICK_LEAVE:
        case STATUS.UNPAID_LEAVE:
        case STATUS.REMOTE_WORK:
            cardIcon = <CalendarOutlined style={cardIconStyle}/>;
            break;
        case 'OVERTIME_REQUEST':
            cardIcon = <ClockCircleOutlined style={cardIconStyle}/>;
            break;
        case 'ACCOUNT_CREATE_REQUEST':
            cardIcon = <UserOutlined style={cardIconStyle}/>;
            break;
        case 'TARGET_REQUEST':
            cardIcon = <StarOutlined style={cardIconStyle}/>;
            break;
        case 'SALARY_INCREASE':
            cardIcon = <DollarOutlined style={cardIconStyle}/>;
            break;
        default:
            cardIcon = <FileTextOutlined style={cardIconStyle}/>;
    }
    switch (typeRequest.code) {
        case STATUS.FUNERAL_LEAVE:
        case STATUS.PATERNITY_LEAVE:
        case STATUS.LEAVE_REQUEST:
        case STATUS.MARRIAGE_LEAVE:
        case STATUS.MATERNITY_LEAVE:
        case STATUS.SICK_LEAVE:
        case STATUS.UNPAID_LEAVE:
        case STATUS.REMOTE_WORK:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Text strong><CalendarOutlined style={iconStyle}/>Ngày bắt đầu nghỉ:</Text>
                            <br/>{dataReq.startDate ? formatDate(dataReq.startDate) : ''}
                        </Col>
                        <Col span={12}>
                            <Text strong><CalendarOutlined style={iconStyle}/>Ngày kết thúc nghỉ:</Text>
                            <br/>{dataReq.endDate ? formatDate(dataReq.endDate) : ''}
                        </Col>
                        <Col span={24}>
                            <Text strong><FileTextOutlined style={iconStyle}/>Lý do:</Text>
                            <br/>{dataReq.reason}
                        </Col>
                    </Row>
                </Card>
            );
        case STATUS.OVERTIME_REQUEST:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Text strong><CalendarOutlined style={iconStyle}/>Ngày tăng ca:</Text>
                            <br/>{dataReq.startDate ? formatDate(dataReq.startDate) : ''}
                        </Col>
                        <Col span={12}>
                            <Text strong><ClockCircleOutlined style={iconStyle}/>Thời gian làm thêm:</Text>
                            <br/>{Array.isArray(dataReq.hours) ? dataReq.hours.join(' - ') : ''}
                        </Col>
                        <Col span={24}>
                            <Text strong><FileTextOutlined style={iconStyle}/>Lý do:</Text>
                            <br/>{dataReq.reason}
                        </Col>
                    </Row>
                </Card>
            );
        case STATUS.ACCOUNT_CREATE_REQUEST:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    <Row gutter={[8, 8]}>
                        <Col span={12}><Text strong><UserOutlined style={iconStyle}/>Họ và
                            tên:</Text><br/>{dataReq.fullName}</Col>
                        <Col span={12}><Text strong><CalendarOutlined style={iconStyle}/>Ngày bắt đầu làm
                            việc:</Text><br/>{dataReq.startDate ? formatDate(dataReq.startDate) : ''}</Col>
                        <Col span={12}><Text strong><MailOutlined style={iconStyle}/>Email:</Text><br/>{dataReq.email}
                        </Col>
                        <Col span={12}><Text strong><PhoneOutlined style={iconStyle}/>Số điện
                            thoại:</Text><br/>{dataReq.phone}</Col>
                        <Col span={12}><Text strong><TagOutlined style={iconStyle}/>Phòng
                            ban:</Text><br/>{dataReq.department}</Col>
                        <Col span={12}><Text strong><TagOutlined style={iconStyle}/>Chức
                            vụ:</Text><br/>{dataReq.position}</Col>
                        {dataReq.note && <Col span={24}><Text strong><FileTextOutlined style={iconStyle}/>Ghi
                            chú:</Text><br/>{dataReq.note}</Col>}
                        <Col span={24}><Text strong><FileTextOutlined style={iconStyle}/>Lý
                            do:</Text><br/>{dataReq.reason}</Col>
                    </Row>
                </Card>
            );
        case STATUS.TARGET_REQUEST:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    <Row gutter={[8, 8]}>
                        <Col span={12}><Text strong><CalendarOutlined
                            style={iconStyle}/>Tháng:</Text><br/>{dataReq.month}</Col>
                        <Col span={12}><Text strong><CalendarOutlined style={iconStyle}/>Năm:</Text><br/>{dataReq.year}
                        </Col>
                        <Col span={24}>
                            <Text strong><FileTextOutlined style={iconStyle}/>Mục tiêu:</Text>
                            <List
                                size="small"
                                bordered
                                style={{marginTop: 8, background: '#fff'}}
                                dataSource={dataReq.goals || []}
                                renderItem={goal => (
                                    <List.Item>
                                        <Text strong>Tiêu đề:</Text> {goal.title} <Text strong>- Mức độ hoàn
                                        thành:</Text> {goal.targetValue}
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col span={24}><Text strong><FileTextOutlined style={iconStyle}/>Lý
                            do:</Text><br/>{dataReq.reason}</Col>
                    </Row>
                </Card>
            );
        case STATUS.SALARY_INCREASE:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    <Row gutter={[8, 8]}>
                        <Col span={12}><Text strong><UserOutlined style={iconStyle}/>Nhân
                            viên:</Text><br/>{dataReq.employeeId}</Col>
                        <Col span={12}><Text strong><TagOutlined style={iconStyle}/>Bộ
                            phận:</Text><br/>{dataReq.department}</Col>
                        <Col span={12}><Text strong><RiseOutlined style={iconStyle}/>Hệ số lương hiện
                            tại:</Text><br/>{dataReq.currentCoefficient}</Col>
                        <Col span={12}><Text strong><DollarOutlined style={iconStyle}/>Số lương hiện
                            tại:</Text><br/>{dataReq.currentSalary}</Col>
                        <Col span={12}><Text strong><RiseOutlined style={iconStyle}/>Hệ số lương đề
                            xuất:</Text><br/>{dataReq.proposedCoefficient}</Col>
                        <Col span={12}><Text strong><DollarOutlined style={iconStyle}/>Số lương đề
                            xuất:</Text><br/>{dataReq.proposedSalary}</Col>
                        <Col span={12}><Text strong><CalendarOutlined style={iconStyle}/>Ngày hiệu
                            lực:</Text><br/>{dataReq.effectiveDate ? formatDate(dataReq.effectiveDate) : ''}</Col>
                        <Col span={24}><Text strong><FileTextOutlined style={iconStyle}/>Lý do đề
                            xuất:</Text><br/>{dataReq.reason}</Col>
                    </Row>
                </Card>
            );
        case STATUS.SALARY_APPROVED:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                </Card>
            );
        default:
            return (
                <Card size="small" bordered style={{background: '#fafcff', marginBottom: 12}}>
                    <div style={{textAlign: 'center'}}>{cardIcon}</div>
                    {Object.entries(dataReq).map(([key, value]) => (
                        <div key={key} style={valueStyle}><Text strong>{key}:</Text> {String(value)}</div>
                    ))}
                </Card>
            );
    }
}
