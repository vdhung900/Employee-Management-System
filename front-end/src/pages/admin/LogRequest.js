import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, DatePicker, Button, Spin, Typography, Statistic, Select, Tag, Modal } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ReloadOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import RequestService from "../../services/RequestService";
import { formatDate } from '../../utils/format';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;


const LogRequest = () => {
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('week');
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect(() => {
        loadData();
    }, [timeRange, pagination.current, pagination.pageSize]);

    const loadData = async () => {
        setLoading(true);
        let body = {};
        body.type = 'year';
        body.page = pagination.current;
        body.limit = pagination.pageSize;
        const resDate = await RequestService.getAllRequests(body);
        setChartData(resDate?.data?.mockData);
        setTableData(resDate?.data?.detailLog?.content);
        setPagination({
            ...pagination,
            current: resDate?.data?.detailLog?.page || 1,
            total: resDate?.data?.detailLog?.totalItems || 0,
            pageSize: resDate?.data?.detailLog?.limit || 10
        });
        setLoading(false);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const totalRequests = chartData.reduce((sum, item) => sum + item.totalRequests, 0);

    const totalSuccess = chartData.reduce((sum, item) => sum + item.successRequests, 0);

    const totalFailed = chartData.reduce((sum, item) => sum + item.failedRequests, 0);

    const successRate = totalRequests > 0 ? ((totalSuccess / totalRequests) * 100).toFixed(2) : 0;

    const getMethodColor = (method) => {
        switch (method?.toUpperCase()) {
            case 'GET':
                return '#52c41a';
            case 'POST':
                return '#1890ff';
            case 'PUT':
                return '#fa8c16';
            case 'DELETE':
                return '#f5222d';
            default:
                return '#d9d9d9';
        }
    };

    const getStatusCodeColor = (statusCode) => {
        if (statusCode >= 200 && statusCode < 300) return '#52c41a';
        if (statusCode >= 300 && statusCode < 400) return '#1890ff';
        if (statusCode >= 400 && statusCode < 500) return '#fa8c16';
        if (statusCode >= 500) return '#f5222d';
        return '#d9d9d9';
    };

    const showDetail = (record, type) => {
        setModalContent({
            title: type === 'body' ? 'Body' : 'Headers',
            content: record[type] ? JSON.stringify(record[type], null, 2) : 'Không có dữ liệu'
        });
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return formatDate(createdAt);
            },
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            render: (method) => (
                <Tag color={getMethodColor(method)} style={{ fontWeight: 'bold' }}>
                    {method}
                </Tag>
            ),
            sorter: (a, b) => a.method.localeCompare(b.method)
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            sorter: (a, b) => a.url.localeCompare(b.url)
        },
        {
            title: 'Status code',
            dataIndex: 'statusCode',
            key: 'statusCode',
            render: (statusCode) => (
                <Tag color={getStatusCodeColor(statusCode)} style={{ fontWeight: 'bold' }}>
                    {statusCode}
                </Tag>
            ),
            sorter: (a, b) => a.statusCode - b.statusCode
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            sorter: (a, b) => a.ipAddress.localeCompare(b.ipAddress)
        },
        {
            title: 'Response Time (ms)',
            dataIndex: 'responseTime',
            key: 'responseTime',
            sorter: (a, b) => a.responseTime - b.responseTime
        },
        {
            title: 'Body',
            dataIndex: 'body',
            key: 'body',
            render: (body, record) => (
                <Button size="small" icon={<EyeOutlined />} onClick={() => showDetail(record, 'body')} />
            )
        },
        {
            title: 'Headers',
            dataIndex: 'headers',
            key: 'headers',
            render: (headers, record) => (
                <Button size="small" icon={<EyeOutlined />} onClick={() => showDetail(record, 'headers')} />
            )
        },
    ];

    const refreshData = () => {
        setLoading(true);
        loadData();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ padding: '10px', maxWidth: '1800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Title level={3}>Thống kê lượt truy cập</Title>
                <div>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={refreshData}
                        loading={loading}
                    >
                        Làm mới
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng số yêu cầu"
                                value={totalRequests}
                                precision={0}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Yêu cầu thành công"
                                value={totalSuccess}
                                precision={0}
                                valueStyle={{ color: '#13c2c2' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Yêu cầu thất bại"
                                value={totalFailed}
                                precision={0}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tỷ lệ thành công"
                                value={successRate}
                                precision={2}
                                suffix="%"
                                valueStyle={{ color: parseFloat(successRate) >= 95 ? '#52c41a' : '#faad14' }}
                                prefix={parseFloat(successRate) >= 95 ? <RiseOutlined /> : <FallOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card title="Thống kê lượt truy cập theo thời gian">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalRequests" stroke="#52c41a" name="Tổng số yêu cầu" />
                                    <Line type="monotone" dataKey="successRequests" stroke="#13c2c2" name="Yêu cầu thành công" />
                                    <Line type="monotone" dataKey="failedRequests" stroke="#ff4d4f" name="Yêu cầu thất bại" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card title="Tỷ lệ yêu cầu thành công/thất bại">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="successRequests" stackId="a" fill="#13c2c2" name="Yêu cầu thành công" />
                                    <Bar dataKey="failedRequests" stackId="a" fill="#ff4d4f" name="Yêu cầu thất bại" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card title="Chi tiết lượt truy cập theo ngày">
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={pagination}
                                onChange={handleTableChange}
                                loading={loading}
                                rowKey="id"
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
            <Modal
                title={modalContent.title}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <pre style={{ maxHeight: 400, overflow: 'auto' }}>{modalContent.content}</pre>
            </Modal>
        </div>
    );
};

export default LogRequest;
