import React from 'react';
import { Result, Button, Alert, Row, Col, Typography, Space } from 'antd';
import { HomeOutlined, ArrowLeftOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Error403Page() {
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Col>
                <Result
                    icon={<StopOutlined style={{ fontSize: 72, color: '#faad14' }} />}
                    status="403"
                    title={<Title level={2}>403 - Forbidden</Title>}
                    subTitle={
                        <Text type="secondary">
                            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền truy cập hoặc đăng nhập lại.
                        </Text>
                    }
                    extra={
                        <Space>
                            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
                                Quay lại
                            </Button>
                            <Button icon={<HomeOutlined />} onClick={() => (window.location.href = '/login')}>
                                Về trang chủ
                            </Button>
                        </Space>
                    }
                />
                <Alert
                    style={{ maxWidth: 480, margin: '0 auto', marginTop: 20 }}
                    message="Lỗi xác thực"
                    description="Tài khoản của bạn không đủ quyền hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại nếu cần."
                    type="error"
                    showIcon
                />
            </Col>
        </Row>
    );
}
